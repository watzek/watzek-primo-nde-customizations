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
import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector'; //for metadata and docid
import {selectDeliveryEntities} from '../utils/DeliveryRecordSelector'; //for bestlocation
//import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'custom-reserves-request',
  standalone: true,
  templateUrl: './reserves-request.component.html',
  styleUrl: './reserves-request.component.scss',
  imports: [MatCardModule, MatIcon, MatButtonModule, MatDialogModule]
})

/**
 * display logic:
 * -user must belong to specific groups
 * AND
 * -format NOT in disallowed list
 * 
 * AND
 * (
 * -item is CDI
 * OR
 * -item is not CDI AND library owns item
 * )
 */




export class ReservesRequestComponent {
  reservesRequestShow = false;
  instCode="01ALLIANCE_LCC";
  formatDenyList =["journal"]

  constructor(private store: Store<any>) {}

  

  ngOnInit() {
    
    this.store.select('user').subscribe(user => {

      if (!user?.jwt) return;

      console.log('USER STATE:', user);
      let isLoggedIn=user?.isLoggedIn;

      const decodedJwt = JSON.parse(atob(user.jwt.split('.')[1]));
      const userGroup = decodedJwt?.userGroup;
      console.log(userGroup);

      

      // may need to check bestlocation to determine if library owns
      //and then, if so, format must not equal 'journals' and maybe others
      this.store.select(selectFullDisplayRecord).subscribe((record) => {
        const docid= record?.pnx?.control?.recordid?.[0];

        var pieces=docid.split("_");

        var isCdi=pieces.includes("cdi");

        var format=record?.pnx.display.type[0];
        var formatCheck = this.formatDenyList.indexOf(format);
          
        if (formatCheck >= 0) {
          const validFormat = false;
        } else {
          const validFormat = true;
        }

        
    
        console.log(docid);

        this.store.select(selectDeliveryEntities).subscribe((deliv) => {
          const recordDelivery = deliv?.[docid];
          console.log(recordDelivery);
          const bestLocation= recordDelivery?.delivery?.bestlocation;
          var valid=this.doesLibraryOwn(recordDelivery);
          console.log(valid);


          


        });


      });





      if (['2', '3'].includes(String(userGroup))) { //only displays if user is member of Alma groups 2 or 3 (Fac or Staff)
        var validUser=true;
        this.reservesRequestShow = true;


      }
      else{
        var validUser=false;
      }


      //if(validUser==true && this.validFormat==true)
      



    });
  }



  doesLibraryOwn(deliv: any){
    console.log(deliv);
    if(deliv?.bestlocation !=null){
      if(this.instCode==deliv.delivery?.bestlocation?.organization){
        return true;
      }
      else{return false;}

    }
    // possibly an ebook or article
    else{
      var availability=deliv?.delivery?.availability;
      var nr="not_restricted";
      var eAvail=availability.indexOf(nr);

      if(eAvail > -1){return true;}
      else{return false;}

    }

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

