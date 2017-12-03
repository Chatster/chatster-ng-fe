import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

import { Router } from '@angular/router';
import { HeaderBarService } from './services/header-bar.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public isAlive = true;
    public joinedRoomName: string;

    public constructor(
        private router: Router,
        private headerBarService: HeaderBarService
    ) { }

    ngOnInit() {
        this.headerBarService.$joinedRoom
            .takeWhile(() => this.isAlive)
            .subscribe(roomName => this.joinedRoomName = roomName);
    }

    public goHome() {
        this.router.navigate(['home']);
    }
}
