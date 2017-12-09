import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-chat-request-dialog',
    templateUrl: './chat-request-dialog.component.html',
    styleUrls: ['./chat-request-dialog.component.scss']
})
export class ChatRequestDialogComponent implements OnInit {
    public userThatWantsToChat: string;

    constructor(
        public dialogRef: MatDialogRef<ChatRequestDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.userThatWantsToChat = data.user;
    }

    ngOnInit() {

    }

    public accept() {
        this.dialogRef.close({ accepted: true });
    }

    public deny() {
        this.dialogRef.close({ accepted: false });
    }

}
