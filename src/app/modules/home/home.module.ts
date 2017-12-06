import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RoomModule } from '../room/room.module';
import { MaterialModule } from '../../material.module';

import { HomeComponent } from './home.component';
import { UsernameDialogComponent } from './username-dialog/username-dialog.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,

        RoomModule,
        MaterialModule,
    ],
    declarations: [
        HomeComponent,
        UsernameDialogComponent
    ],
    entryComponents: [
        UsernameDialogComponent
    ]
})
export class HomeModule { }
