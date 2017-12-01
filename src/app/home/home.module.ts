import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';

import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }
