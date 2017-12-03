import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatBoxComponent } from '../../components/chat-box/chat-box.component';
import { JoinedRoomComponent } from './joined-room.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ChatBoxComponent,
        JoinedRoomComponent,
    ]
})
export class JoinedRoomModule { }
