import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnDestroy, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RoomDTO } from '../../x-shared/dtos/Room.dto';
import { ChatRequestDTO } from '../../x-shared/dtos/ChatRequest.dto';
import { MessageSendDTO } from '../../x-shared/dtos/MessageSend.dto';
import { RoomJoinRequestDTO } from '../../x-shared/dtos/RoomJoinRequest.dto';
import { ClientRegistrationDTO } from '../../x-shared/dtos/ClientRegistration.dto';
import { NewMessageReceivedDTO } from '../../x-shared/dtos/NewMessageReceived.dto';
import { ChatRequestResponseDTO } from '../../x-shared/dtos/ChatRequestResponse.dto';

import { Message } from '../../x-shared/entities/Message.entity';
import { SocketUser } from '../../x-shared/entities/SocketUser.entity';
import { Conversation } from '../../x-shared/entities/Conversation.entity';
import { ChatApproval } from '../../x-shared/entities/ChatApproval.entity';

import { SocketEventType } from '../../x-shared/events/SocketEventType';

import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatRequestDialogComponent } from './chat-request-dialog/chat-request-dialog.component';

import { BaseRoom } from '../../core/BaseRoom.core';
import { HeaderBarService } from '../../services/header-bar.service';
import { MessageColors } from '../../x-shared/enums/MessageColors.enum';

@Component({
    selector: 'app-joined-room',
    templateUrl: './joined-room.component.html',
    styleUrls: ['./joined-room.component.scss']
})
export class JoinedRoomComponent extends BaseRoom implements OnDestroy {
    private id: string;
    private username: string;
    private pendingChatsApprovals: ChatApproval[] = [];

    public isAlive = true;
    public mySockId: string;

    public onlineUsers: SocketUser[] = [
        {
            username: 'All',
            socketId: null,
            isFake: true
        }
    ];

    public conversations: Conversation[] = [];
    public activeConversation: Conversation;
    public receiverUsername: string;
    public receiverSockId: string;

    @ViewChild(ChatBoxComponent) public chatBoxComponent: ChatBoxComponent;
    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private headerBarService: HeaderBarService,
    ) {
        super();

        this.route.params
            .takeWhile(() => this.isAlive)
            .subscribe(params => {
                this.id = params['id'];
                this.username = params['username'];
                this.onlineUsers[0].socketId = this.appendToMainSocketAddress(this.id);
                this.setFirstPrivateConversationToLobby();
                this.connectToSocket(this.appendToMainSocketAddress(this.id));
            });
    }

    ngOnDestroy() {
        this.isAlive = false;
        this.headerBarService.setJoinedRoom(null);
        this.disconnectFromSocket();
    }

    public onRestorePrivateChatFocus(conv: Conversation) {
        this.deactivateAllConversations();
        this.activateConversation(conv.sockId);
    }

    public onClosePrivateChat(conv: Conversation) {
        if (conv.sockId === this.activeConversation.sockId) {
            //  Closing the active conv
            this.conversations = this.conversations.filter(c => c.sockId !== conv.sockId);
            this.activateConversation(this.appendToMainSocketAddress(this.id));
        }

        this.conversations = this.conversations.filter(c => c.sockId !== conv.sockId);
    }

    public onNewPrivateChat(user: SocketUser) {
        this.deactivateAllConversations();

        if (user.isIgnoringYou) {
            this.snackBar.open('This user is ignoring you.', null, { duration: 2000 });
            return;
        }

        const conv = this.conversations.find(conv => conv.sockId === user.socketId);
        if (!!conv) {
            conv.isInvisible = false;   //  If the conv where invisible, set it visible forcefully
            this.activateConversation(user.socketId);
            return;
        }

        if (user.isFake) {
            this.addConversationInList(user);
            return;
        }

        //  Need to send request to user first
        const requestDTO = new ChatRequestDTO();
        requestDTO.toSockId = user.socketId;
        requestDTO.fromSockId = this.mySockId;

        this.addConversationInList(user);
        this.socket.emit(SocketEventType.client.chatRequest, requestDTO);
    }

    private addConversationInList(user: SocketUser, silentActivation?: boolean) {
        const newConv: Conversation = {
            messages: [],
            with: user.username,
            sockId: user.socketId,
            isInvisible: silentActivation,
            isCurrentActive: silentActivation ? false : true,
        };

        //  If the conversation already exists, don't duplicate it.
        if (!this.conversations.find(conv => conv.sockId === newConv.sockId)) {
            this.conversations.push(newConv);
        }

        //  If silentActivation is on, it means that the conv is still in an approval phase.
        //  But adding the conv to the convs list, will allow us to collect the messages even if the conv is not visible
        if (!silentActivation) {
            this.deactivateAllConversations();
            this.activateConversation(user.socketId);
        }
    }

    public onMessageSend(message: Message) {
        const user = this.onlineUsers.find(usr => usr.socketId === message.toSockId);
        if (!!user) {
            const messageDTO = new MessageSendDTO();
            messageDTO.fromSockId = message.fromSockId;
            messageDTO.toSockId = message.toSockId;
            messageDTO.fromUsername = message.fromUsername;
            messageDTO.toUsername = message.toUsername;
            messageDTO.message = message.text;

            this.socket.emit(SocketEventType.message.send, messageDTO);
        }

        this.addMessageToConversationAndScrollDown(message, true);
    }

    private getConversation(convSockId: string): Conversation | boolean {
        const conv = this.conversations.find(conversation => conversation.sockId === convSockId);

        if (!conv) {
            //  The current user has closed the chat with the other one
            return false;
        }

        if (!conv.messages) {
            conv.messages = [];
        }

        return conv;
    }

    private setFirstPrivateConversationToLobby() {
        const lobbyConv = new Conversation();
        lobbyConv.with = 'All';
        lobbyConv.messages = [];
        lobbyConv.cannotBeClosed = true;
        lobbyConv.isCurrentActive = true;
        lobbyConv.sockId = this.appendToMainSocketAddress(this.id);

        this.deactivateAllConversations();
        this.conversations.push(lobbyConv);
        this.activateConversation(lobbyConv.sockId);
    }

    private deactivateAllConversations() {
        this.conversations.forEach(c => c.isCurrentActive = false);
    }

    private activateConversation(sockId: string, skipChatActivation?: boolean) {
        if (this.conversations.find(c => c.sockId === sockId)) {
            //  Set the conversation to Active in the conversations array
            this.conversations.forEach(c => c.sockId === sockId ? c.isCurrentActive = true : null);

            //  Set all the messages to 'read'
            this.conversations.find(c => c.sockId === sockId)
                .messages
                .forEach(msg => msg.isNewMessage = false);

            //  Assing the conversation to the active conversation
            this.activeConversation = this.conversations.find(c => c.sockId === sockId);

            //  Update receiver data
            this.receiverSockId = sockId;
            if (sockId !== this.conversations[0].sockId) {
                this.receiverUsername = this.onlineUsers.find(usr => usr.socketId === sockId).username;
                return;
            }

            this.receiverUsername = this.conversations[0].with;
        }
    }

    private addMessageToConversationAndScrollDown(message: Message, invertSocketId?: boolean) {
        const conv = this.conversations
            .find(conversation => conversation.sockId === (invertSocketId ? message.toSockId : message.fromSockId));

        if (!conv) { return; }
        if (!conv.messages) {
            conv.messages = [];
        }

        conv.messages.push(message);
        setTimeout(() => this.chatBoxComponent.scrollDown(), 10);
    }

    private handleChatRequest(data: ChatRequestDTO) {
        const userThatWantsToChat = this.onlineUsers.find(usr => usr.socketId === data.fromSockId);

        if (this.onlineUsers.find(usr => usr.socketId === userThatWantsToChat.socketId).ignoreChatRequests) {
            //  This user already tried to chat with the current one. And the user has ignored him.
            //  So don't bother him with other requests from the same user.
            return;
        }

        //  Silently add the conversation to the list.
        //  (in this way when the user approves, all the messages sent by the other side will be present)
        this.addConversationInList(this.onlineUsers.find(usr => usr.socketId === data.fromSockId), true);

        //  If is the same user sending a new message again, and the user hasn't approved yet the chat request, skip the dialog
        //  When the user will approve the first one, all the messages will be available too.
        if (this.pendingChatsApprovals.find(pca => pca.fromSockId === data.fromSockId)) { return; }
        this.pendingChatsApprovals.push({ fromSockId: data.fromSockId });

        const dialogRef = this.dialog
            .open(ChatRequestDialogComponent, { disableClose: false, data: { user: userThatWantsToChat.username } });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                const responseDTO = new ChatRequestResponseDTO();

                responseDTO.accepted = true;
                responseDTO.toSockId = data.toSockId;
                responseDTO.fromSockId = data.fromSockId;

                if (!result || !result.accepted) {
                    responseDTO.accepted = false;
                    this.onlineUsers.find(usr => usr.socketId === data.fromSockId).ignoreChatRequests = true;
                } else {
                    //  This time we add the conversation again, which won't duplicate the entry, but we'll activate the previous one
                    //  But we first have to uncheck it as 'ivisible'
                    this.conversations.find(conv => conv.sockId === data.fromSockId).isInvisible = false;
                    this.addConversationInList(this.onlineUsers.find(usr => usr.socketId === data.fromSockId));
                    //  remove the pending chat approval only if the user accepts it
                    this.pendingChatsApprovals = this.pendingChatsApprovals.filter(pca => pca.fromSockId !== data.fromSockId);
                }

                this.socket.emit(SocketEventType.client.chatRequestResponse, responseDTO);
            });
    }

    //  Base class implementation
    protected onConnectionEstablished(): void {
        this.mySockId = this.socket.id;

        const clientRegistrationDTO = new ClientRegistrationDTO();
        clientRegistrationDTO.username = this.username;
        this.socket.emit(SocketEventType.client.registration, clientRegistrationDTO);

        this.socket.on(SocketEventType.client.registered, (data: RoomDTO) => {
            this.onlineUsers = data.users.filter(user => user.socketId !== this.socket.id);
            this.headerBarService.setJoinedRoom(data.name);
        });

        this.socket.on(SocketEventType.client.connected, (data: RoomDTO) => {
            this.onlineUsers = data.users.filter(usr => usr.socketId !== this.socket.id);
        });

        this.socket.on(SocketEventType.client.chatRequest, (data: ChatRequestDTO) => {
            this.handleChatRequest(data);
        });

        this.socket.on(SocketEventType.client.chatRequestResponse, (data: ChatRequestResponseDTO) => {
            const infoMessage = new Message();
            if (!data.accepted) {
                infoMessage.info = 'The user has declined your chat request. Further messages wont\'t be delivered';
                infoMessage.infoColor = MessageColors.red;

                this.onlineUsers.find(user => user.socketId === data.toSockId).isIgnoringYou = true;
            } else {
                infoMessage.info = 'The user has accepted your private chat request';
                infoMessage.infoColor = MessageColors.green;
            }


            if (this.getConversation(data.toSockId)) {
                (this.getConversation(data.toSockId) as Conversation).messages.push(infoMessage);
            }
        });

        this.socket.on(SocketEventType.message.newMessage, (data: NewMessageReceivedDTO) => {
            if (!this.conversations.find(conv => conv.sockId === data.fromSockId)) {
                //  If the current user has closed the private chat with the one who sent the message,
                //  Re present the new private chat dialog
                const chatRequestDTO = new ChatRequestDTO();
                chatRequestDTO.fromSockId = data.fromSockId;
                chatRequestDTO.toSockId = data.toSockId;
                this.handleChatRequest(chatRequestDTO);
            }

            const answer = new Message();
            answer.fromSockId = data.fromSockId;
            answer.fromUsername = data.fromUsername;
            answer.toSockId = data.toSockId;
            answer.text = data.message;
            answer.isNewMessage = this.activeConversation.sockId === answer.fromSockId ? false : true;

            this.addMessageToConversationAndScrollDown(answer);
        });
    }
}
