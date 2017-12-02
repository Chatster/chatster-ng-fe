import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RoomModule } from '../room/room.module';
import { MaterialModule } from '../material.module';

import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,

        RoomModule,
        MaterialModule,
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }
