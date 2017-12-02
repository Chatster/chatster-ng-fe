import { EventEmitter, Input, Output, Component, OnInit } from '@angular/core';
import { RoomDTO } from '../x-shared/dtos/Room.dto';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    @Input() public room: RoomDTO;
    @Output() public joinRoom: EventEmitter<RoomDTO> = new EventEmitter();
    constructor() { }

    ngOnInit() {
        console.log(this.room.name);
    }

    public joinThisRoom() {
        this.joinRoom.emit(this.room);
    }

}
