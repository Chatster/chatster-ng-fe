import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,

        MatTabsModule,
        MatListModule,
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatFormFieldModule,
    ],
    exports: [
        MatTabsModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatFormFieldModule
    ]
})
export class MaterialModule { }
