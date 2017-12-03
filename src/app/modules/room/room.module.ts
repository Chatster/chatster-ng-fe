import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { RoomComponent } from './room.component';

@NgModule({
    imports: [
        CommonModule,

        MaterialModule,
    ],
    declarations: [RoomComponent],
    exports: [RoomComponent]
})
export class RoomModule { }
