import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private host: SocketIOClient.Socket;
    private address = 'localhost:4000/';

    public username: string;
    public roomName: string;


    public canChat: boolean;
    public message: string;
    public chatDataCollection: { message: string, info?: boolean, from?: string }[];

    constructor() {
        this.host = io.connect(this.address);
    }

    public joinRoom() {
        this.host.emit('client.registration', { username: this.username, room: this.roomName });
        this.host.on('client.connected', () => {
            console.log('Connected to the host socket');
        });

        this.host.on('client.registered', (data: { username: string }) => {
            this.chatDataCollection.push({
                message: `${data.username} has connected`,
                info: true
            });
            if (this.username === data.username) {
                this.canChat = true;
            }
        });
    }

    public sendMessage() {
        if (!this.message || !this.message.length) { return; }
        this.host.emit('message.send', { message: this.message, user: this.username });
        this.message = '';
    }

    ngOnInit() {
        this.chatDataCollection = [];
        this.host.on('message.new', (messageData: { message: string, from: string }) => {
            this.chatDataCollection.push({
                message: messageData.message,
                from: messageData.from
            });
        });

        this.host.on('client.disconnected', (client: { username: string }) => {
            this.chatDataCollection.push({
                message: client.username + ' has disconnected',
                info: true
            });
        });
    }

}
