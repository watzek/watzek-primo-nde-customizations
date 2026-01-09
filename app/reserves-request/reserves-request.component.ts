import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {Store} from '@ngrx/store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
//import { jwtDecode } from 'jwt-decode';


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

  constructor(private store: Store, private http: HttpClient) { }

  const selectUserFeature = createFeatureSelector<{isLoggedIn: boolean}>('user');
const selectIsLoggedIn = createSelector(selectUserFeature, state => state.isLoggedIn);

      ngOnInit() {
          this.store.select(selectFullDisplayRecord).subscribe((record) => {
              console.log('Record:', record);
              const pnx = record?.pnx?.control;
              console.log('PNX:', pnx);
              const pnxfull = record?.pnx?.addata?.url;
              console.log('PNX Full:', pnxfull);
              // Extract the source record ID from the record's PNX control field
              const recordId = record?.pnx?.control?.sourcerecordid;
  
              if (Array.isArray(recordId) && typeof recordId[0] === 'string') {
                  this.selectedRecordId = recordId[0];
              }
          });
        }



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
    imports: [
    MatDialogTitle, 
    MatDialogContent, 
    FormsModule,
    MatFormFieldModule,  // Add this
    MatInputModule       // You'll likely need this too for input fields
  ],
})
export class ReservesRequestDialog {
  data = inject(MAT_DIALOG_DATA);
}
