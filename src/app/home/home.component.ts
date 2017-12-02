import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

import { RoomsListDTO } from '../x-shared/dtos/RoomsList.dto';
import { SocketEventType } from '../x-shared/events/SocketEventType';
import { RoomDTO } from '../x-shared/dtos/Room.dto';
import { BaseRoom } from '../core/BaseRoom.core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseRoom implements OnInit {
    public rooms: RoomDTO[] = [];

    constructor(
        private router: Router
    ) {
        super();
        this.connectToSocket(this.appendToMainSocketAddress('home'));
    }

    //  Base class implementation
    protected onConnectionEstablished(): void {
        this.socket.emit(SocketEventType.room.requestList);

        this.socket.on(SocketEventType.room.responseList, (data: RoomsListDTO) => {
            console.log(this.rooms);
            this.rooms = data.rooms;
        });
    }

    public ngOnInit() {
    }

    public joinRoom(room: RoomDTO) {
        this.router.navigate(['room', room.id])
            .then(() => this.socket.disconnect());
    }
}
