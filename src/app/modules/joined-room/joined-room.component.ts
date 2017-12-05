import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RoomDTO } from '../../x-shared/dtos/Room.dto';
import { RoomJoinRequestDTO } from '../../x-shared/dtos/RoomJoinRequest.dto';

import { Message } from '../../x-shared/entities/Message.entity';
import { SocketUser } from '../../x-shared/entities/SocketUser.entity';
import { Conversation } from '../../x-shared/entities/Conversation.entity';

import { SocketEventType } from '../../x-shared/events/SocketEventType';

import { BaseRoom } from '../../core/BaseRoom.core';
import { HeaderBarService } from '../../services/header-bar.service';

@Component({
    selector: 'app-joined-room',
    templateUrl: './joined-room.component.html',
    styleUrls: ['./joined-room.component.scss']
})
export class JoinedRoomComponent extends BaseRoom implements OnDestroy {
    private id: string;

    public isAlive = true;
    public mySockId: string;

    public onlineUsers: SocketUser[] = [
        {
            username: 'All',
            socketId: null,
            isFake: true
        },
        {
            username: 'Mandy',
            socketId: 'mnd'
        },
        {
            username: 'Peter',
            socketId: 'ptr'
        },
        {
            username: 'Chester',
            socketId: 'csr'
        },
        {
            username: 'Jimmy',
            socketId: 'jmy'
        },
        {
            username: 'Connor',
            socketId: 'cnr'
        },
        {
            username: 'Hailey',
            socketId: 'hly'
        },
    ];

    public conversations: Conversation[] = [];
    public activeConversation: Conversation;
    public receiverUsername: string;
    public receiverSockId: string;

    constructor(
        private route: ActivatedRoute,
        private headerBarService: HeaderBarService,
    ) {
        super();

        this.route.params
            .takeWhile(() => this.isAlive)
            .subscribe(params => {
                this.id = params['id'];
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

    public onOpenPrivateChat(conv: Conversation) {
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

        if (this.conversations.find(conv => conv.sockId === user.socketId)) {
            this.activateConversation(user.socketId);
            return;
        }

        //  Need to send request to user first
        const newConv: Conversation = {
            messages: [],
            with: user.username,
            sockId: user.socketId,
            isCurrentActive: true,
        };

        this.conversations.push(newConv);
        this.activateConversation(user.socketId);
    }

    public onMessageSend(message: Message) {
        this.conversations.find(conv => conv.sockId === message.toSockId)
            .messages
            .push(message);

        if (message.toSockId !== this.activeConversation.sockId) {
            //  It's not the current active chat view, set a notification next to the username
            return;
        }

        //  TODO remove [Fake answer from server]
        setTimeout(() => {
            const answer = new Message();
            answer.fromSockId = message.toSockId;
            answer.fromUsername = message.toUsername;
            answer.toSockId = message.fromSockId;
            answer.text = `Default answer to: "${message.text}"`;
            answer.isNewMessage = this.activeConversation.sockId === answer.fromSockId ? false : true;

            this.conversations.find(conv => conv.sockId === message.toSockId)
                .messages
                .push(answer);

        }, 500);
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
            this.receiverUsername = this.onlineUsers.find(usr => usr.socketId === sockId).username;
        }
    }

    //  Base class implementation
    protected onConnectionEstablished(): void {
        this.mySockId = this.socket.id;
        this.socket.on(SocketEventType.room.roomData, (data: RoomDTO) => {
            this.headerBarService.setJoinedRoom(data.name);
        });
    }

}
