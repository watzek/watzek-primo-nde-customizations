import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent, MatDialogModule} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
//import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
//import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'custom-reserves-request',
  standalone: true,
  templateUrl: './reserves-request.component.html',
  styleUrl: './reserves-request.component.scss',
  imports: [MatCardModule, MatIcon, MatButtonModule, MatDialogModule]
})
export class ReservesRequestComponent {
  reservesRequestShow = false;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store.select('user').subscribe(user => {

      if (!user?.jwt) return;

      console.log('USER STATE:', user);
      let isLoggedIn=user?.isLoggedIn;

      const decodedJwt = JSON.parse(atob(user.jwt.split('.')[1]));
      const userGroup = decodedJwt?.userGroup;
      console.log(userGroup);

      if (['2', '3'].includes(String(userGroup))) { //only displays if user is member of Alma groups 2 or 3 (Fac or Staff)
        console.log('you are legit');
        this.reservesRequestShow = true;


      }
      



    });
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ReservesRequestDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    //need to get title, callNumber, author, location, permalink, availability, 




  }





}



@Component({
  selector: 'reserves-request-dialog',
  templateUrl: 'reserves-request-dialog.html',
  standalone: true,
  styleUrl: './reserves-request.component.scss',
    imports: [

    FormsModule,
   // MatFormFieldModule,  // Add this
    MatInputModule ,
   // MatSelectModule ,
    MatDialogModule     // You'll likely need this too for input fields
  ],
})
export class ReservesRequestDialog {
  data = inject(MAT_DIALOG_DATA);
    courseDetails = {
    course: '',
    courseTitle: '',
    loanPeriod: '',
    comments: ''
  };

    submitForm(form: any): void {
    if (form.valid) {
      console.log('Form data:', this.courseDetails);
    }
  }
}

