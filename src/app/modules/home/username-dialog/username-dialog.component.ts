import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-username-dialog',
    templateUrl: './username-dialog.component.html',
    styleUrls: ['./username-dialog.component.scss']
})
export class UsernameDialogComponent implements OnInit {
    public username: string;

    constructor(
        public dialogRef: MatDialogRef<UsernameDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    public cancelJoin() {
        this.dialogRef.close({ canceled: true });
    }

    public checkIfAvailable() {
        if (!this.username || !this.username.length) { return; }
        //  Check if username available

        this.dialogRef.close({ username: this.username });
    }

    ngOnInit() {
    }

}
