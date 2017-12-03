import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { BaseRoom } from '../../core/BaseRoom.core';

import { RoomDTO } from '../../x-shared/dtos/Room.dto';
import { SocketEventType } from '../../x-shared/events/SocketEventType';
import { RoomJoinRequestDTO } from '../../x-shared/dtos/RoomJoinRequest.dto';

import { HeaderBarService } from '../../services/header-bar.service';

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
        private headerBarService: HeaderBarService,
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
        this.headerBarService.setJoinedRoom(null);
        this.disconnectFromSocket();
    }

    //  Base class implementation
    protected onConnectionEstablished(): void {
        this.socket.on(SocketEventType.room.roomData, (data: RoomDTO) => {
            this.headerBarService.setJoinedRoom(data.name);
        });
    }

}
