import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';
import { JoinedRoomComponent } from './modules/joined-room/joined-room.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'room/:id', component: JoinedRoomComponent },

    { path: '**', component: HomeComponent }
];
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
