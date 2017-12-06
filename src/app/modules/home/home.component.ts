import * as io from 'socket.io-client';

import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RoomDTO } from '../../x-shared/dtos/Room.dto';
import { RoomsListDTO } from '../../x-shared/dtos/RoomsList.dto';

import { SocketEventType } from '../../x-shared/events/SocketEventType';

import { BaseRoom } from '../../core/BaseRoom.core';
import { UsernameDialogComponent } from './username-dialog/username-dialog.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseRoom {
    public rooms: RoomDTO[] = [];

    constructor(
        private router: Router,
        public dialog: MatDialog
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
        const dialogRef = this.dialog.open(UsernameDialogComponent, { disableClose: true });

        dialogRef.afterClosed().subscribe(result => {
            if (!!result) {
                if (result.canceled) {
                    return;
                }

                this.router.navigate(['room', room.id, result.username])
                    .then(() => this.socket.disconnect());
            }
        });
    }
}
