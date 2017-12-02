import { Component } from '@angular/core';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public isAlive = true;

    public constructor(
        private router: Router
    ) { }

    public goHome() {
        this.router.navigate(['home']);
    }
}
