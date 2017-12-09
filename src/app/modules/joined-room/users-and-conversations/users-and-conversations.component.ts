import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SocketUser } from '../../../x-shared/entities/SocketUser.entity';
import { Conversation } from '../../../x-shared/entities/Conversation.entity';
import { Message } from '../../../x-shared/entities/Message.entity';

@Component({
    selector: 'app-users-and-conversations',
    templateUrl: './users-and-conversations.component.html',
    styleUrls: ['./users-and-conversations.component.scss']
})
export class UsersAndConversationsComponent {

    @Input() public conversations: Conversation[];
    @Input() public onlineUsers: SocketUser[];

    @Output() public newPrivateChat: EventEmitter<SocketUser> = new EventEmitter();
    @Output() public closePrivateChat: EventEmitter<Conversation> = new EventEmitter();
    @Output() public restorePrivateChatFocus: EventEmitter<Conversation> = new EventEmitter();

    constructor() { }

    public newMessages(messages: Message[]) {
        return messages.filter(msg => msg.isNewMessage).length !== 0;
    }

    public emitNewPrivateChatRequest(withUser: SocketUser) {
        this.newPrivateChat.emit(withUser);
    }

    public emitPrivateChatRestoreRequest(conversation: Conversation) {
        this.restorePrivateChatFocus.emit(conversation);
    }

    public emitPrivateChatCloseRequest(event: MouseEvent, conversation: Conversation) {
        this.closePrivateChat.emit(conversation);
    }

}
