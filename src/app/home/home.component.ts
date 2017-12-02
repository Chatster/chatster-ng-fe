import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

import { RoomsListDTO } from '../x-shared/dtos/RoomsList.dto';
import { SocketEventType } from '../x-shared/events/SocketEventType';
import { RoomDTO } from '../x-shared/dtos/Room.dto';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private host: SocketIOClient.Socket;
    private address = 'localhost:4000/';

    public rooms: RoomDTO[] = [];

    constructor() {
        this.host = io.connect(this.address);
    }

    public ngOnInit() {
        this.host.on(SocketEventType.client.connected, () => {
            this.host.emit(SocketEventType.room.requestList);

            this.host.on(SocketEventType.room.responseList, (data: RoomsListDTO) => {
                console.log(this.rooms);
                this.rooms = data.rooms;
            });
        });
    }

    public joinRoom(room: RoomDTO) {
        this.host.disconnect();
    }
}
