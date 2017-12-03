import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HeaderBarService {
    private _$joinedRoom: BehaviorSubject<string> = new BehaviorSubject(null);

    public get $joinedRoom(): Observable<string> {
        return this._$joinedRoom.asObservable();
    }

    public setJoinedRoom(roomName: string) {
        this._$joinedRoom.next(roomName);
    }
}
