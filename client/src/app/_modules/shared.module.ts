import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFileUploadModule } from 'mat-file-upload';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule ,
    MatSnackBarModule, 
    MatCheckboxModule,
    MatRadioModule,
    MatFileUploadModule,
    NgxDropzoneModule,
    MatIconModule
  ],
  exports:[
    MatMenuModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFileUploadModule,
    NgxDropzoneModule,
    MatIconModule
  ],
  providers: [
    // ... other providers
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000, // Adjust the duration as needed
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      },
    },
  ],
})
export class SharedModule { }
