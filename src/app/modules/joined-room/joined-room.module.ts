import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { JoinedRoomComponent } from './joined-room.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { UsersAndConversationsComponent } from './users-and-conversations/users-and-conversations.component';
import { NewMessagesPipe } from '../../pipes/new-messages.pipe';
import { ChatRequestDialogComponent } from './chat-request-dialog/chat-request-dialog.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,

        MaterialModule,
    ],
    declarations: [
        NewMessagesPipe,

        ChatBoxComponent,
        JoinedRoomComponent,
        ChatRequestDialogComponent,
        UsersAndConversationsComponent,
    ],
    entryComponents: [
        ChatRequestDialogComponent
    ],
    providers: [
    ]
})
export class JoinedRoomModule { }
