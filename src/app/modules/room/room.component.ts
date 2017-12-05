import { EventEmitter, Input, Output, Component } from '@angular/core';
import { RoomDTO } from '../../x-shared/dtos/Room.dto';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent {
    @Input() public room: RoomDTO;
    @Output() public joinRoom: EventEmitter<RoomDTO> = new EventEmitter();

    public joinThisRoom() {
        this.joinRoom.emit(this.room);
    }
}
