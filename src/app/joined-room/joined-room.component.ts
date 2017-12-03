import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { BaseRoom } from '../core/BaseRoom.core';

import { SocketEventType } from '../x-shared/events/SocketEventType';
import { RoomDTO } from '../x-shared/dtos/Room.dto';
import { RoomJoinRequestDTO } from '../x-shared/dtos/RoomJoinRequest.dto';

@Component({
    selector: 'app-joined-room',
    templateUrl: './joined-room.component.html',
    styleUrls: ['./joined-room.component.scss']
})
export class JoinedRoomComponent extends BaseRoom implements OnInit, OnDestroy {
    public isAlive = true;
    private id: string;

    constructor(
        private route: ActivatedRoute,
    ) {
        super();
        this.route.params
            .takeWhile(() => this.isAlive)
            .subscribe(params => {
                this.id = params['id'];
                this.connectToSocket(this.appendToMainSocketAddress(this.id));
            });
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.isAlive = false;
        this.disconnectFromSocket();
    }

    //  Base class implementation
    protected onConnectionEstablished(): void {
        this.socket.on(SocketEventType.room.roomData, (data: RoomDTO) => {
            console.log(data);
        });
    }

}
