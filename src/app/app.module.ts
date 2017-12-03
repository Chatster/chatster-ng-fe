import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './routing.module';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';
import { JoinedRoomModule } from './joined-room/joined-room.module';
import { HeaderBarService } from './services/header-bar.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,

        MaterialModule,
        AppRoutingModule,

        HomeModule,
        JoinedRoomModule
    ],
    providers: [
        HeaderBarService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
