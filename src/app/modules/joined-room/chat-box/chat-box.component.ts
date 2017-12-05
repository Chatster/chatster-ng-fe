import { EventEmitter, Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';

import { Message } from '../../../x-shared/entities/Message.entity';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
    public currentMessage: string;

    @Input() public messages: Message[];
    @Input() public mySockId: string;
    @Input() public myUsername: string;
    @Input() public receiverSockId: string;
    @Input() public receiverUsername: string;

    @Output() public sendMessage: EventEmitter<Message> = new EventEmitter();
    @ViewChild('messagesBox') public messagesBox: ElementRef;

    constructor() { }

    ngOnInit() {
    }

    public scrollDown() {
        this.messagesBox.nativeElement.scrollTop = this.messagesBox.nativeElement.scrollHeight;
    }

    public send() {
        if (!this.currentMessage || !this.currentMessage.trim().length) {
            return;
        }

        const newMessage = new Message();
        newMessage.fromMe = true;
        newMessage.text = this.currentMessage;

        newMessage.fromUsername = null;
        newMessage.fromSockId = this.mySockId;

        newMessage.toSockId = this.receiverSockId;
        newMessage.toUsername = this.receiverUsername;
        newMessage.isNewMessage = false;

        this.sendMessage.emit(newMessage);
        this.currentMessage = '';

        setTimeout(() => this.scrollDown(), 10);
    }
}
