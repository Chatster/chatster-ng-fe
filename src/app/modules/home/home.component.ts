import * as io from 'socket.io-client';

import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { RoomDTO } from '../../x-shared/dtos/Room.dto';
import { RoomsListDTO } from '../../x-shared/dtos/RoomsList.dto';

import { SocketEventType } from '../../x-shared/events/SocketEventType';

import { BaseRoom } from '../../core/BaseRoom.core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseRoom {
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
            this.rooms = data.rooms;
        });
    }

    public joinRoom(room: RoomDTO) {
        this.router.navigate(['room', room.id])
            .then(() => this.socket.disconnect());
    }
}
