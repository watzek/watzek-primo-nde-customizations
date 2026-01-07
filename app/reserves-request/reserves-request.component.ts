import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


//https://material.angular.dev/components/dialog/examples
// https://blog.angular-university.io/angular-material-dialog/


@Component({
  selector: 'custom-reserves-request',
  standalone: true,
  imports: [MatCardModule, MatIcon, MatButtonModule, MatDialogModule],
  templateUrl: './reserves-request.component.html',
  styleUrl: './reserves-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservesRequestComponent {



  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ReservesRequestDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'reserves-request-dialog',
  templateUrl: 'reserves-request-dialog.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
})
export class ReservesRequestDialog {
  data = inject(MAT_DIALOG_DATA);
}
