import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import {MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
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
  imports: [MatCardModule, MatIcon, MatButtonModule, MatDialogModule, CommonModule]
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
  formatDenyList =["journal"];
  validUser=false;
  validFormat=false;
  isCdi=false;
  libraryOwns=false;
  title='';
  author='';
  callNumber='';
  location='';
  permaLink='';
  delivCat="";
  availability="";
  vid: string | null = this.getUrlParameter('vid');
  context="";
  docid="";

  

  private destroyRef = inject(DestroyRef);

  constructor(private store: Store<any>) {}

  ngOnInit() {

    //combineLatest re-runs this whenever user, record, or delivery data changes,
    //so the display decision is always made with the latest values of all three
    combineLatest([
      this.store.select('user'),
      this.store.select(selectFullDisplayRecord),
      this.store.select(selectDeliveryEntities)
    ]).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, record, deliv]) => {

      //for user details
      if (user?.jwt) {
        const decodedJwt = JSON.parse(atob(user.jwt.split('.')[1]));
        const userGroup = decodedJwt?.userGroup;
        //only displays if user is member of Alma groups 2 or 3 (Fac or Staff)
        this.validUser = ['2', '3'].includes(String(userGroup));
      }
      else {
        this.validUser = false;
      }

      //for pnx details; record may not be loaded yet
      if (!record?.pnx) {
        this.updateDisplay();
        return;
      }
      this.docid = record.pnx.control?.recordid?.[0] ?? "";

      var pieces=this.docid.split("_");
      this.isCdi=pieces.includes("cdi");

      if(this.isCdi==true){this.context="PC";}
      else{this.context="L";}

      var format=record.pnx.display?.type?.[0];
      this.validFormat = !this.formatDenyList.includes(format);
      this.title = record.pnx.display?.title?.[0];
      this.author = record.pnx.addata?.au?.[0];

      //for delivery details; may arrive after the record
      const recordDelivery = deliv?.[this.docid];
      this.libraryOwns=this.doesLibraryOwn(recordDelivery);

      //callNumber lookup should depend on delivery category
      var dCat=recordDelivery?.delivery?.deliveryCategory ?? [];
      if(dCat.includes("Alma-E")){
        this.delivCat="Alma-E";
        this.callNumber="N/A";
        this.location="Electronic Resource";
        this.availability="Electronic";
      }
      if(dCat[0]=="Alma-P" && dCat.length==1){
        this.delivCat="Alma-P";
        const bestLocation = recordDelivery?.delivery?.bestlocation;
        if(bestLocation==null){
          this.location="N/A";
          this.availability="N/A";
        }
        else{
          this.location=bestLocation.mainLocation+" "+bestLocation.subLocation;
          this.availability=bestLocation.availabilityStatus;
        }
        this.callNumber = bestLocation?.callNumber;
      }

      this.updateDisplay();
    });
  }

  updateDisplay(){
    this.reservesRequestShow = this.validUser==true && this.validFormat==true && (this.isCdi==true || (this.isCdi==false && this.libraryOwns==true));
    console.log("conditions "+(this.reservesRequestShow ? "met" : "not met")+" for reserves request:");
    console.log("validUser:"+this.validUser+", validFormat:"+this.validFormat+", isCdi:"+this.isCdi+", libraryOwns:"+this.libraryOwns);
  }

  getPermaLink(){
    //sample: https://primo.lclark.edu/nde/fulldisplay?docid=alma99142271980101844&context=L&vid=01ALLIANCE_LCC:LCCNDETEST&tab=default_tab&lang=en_US
    var url="https://primo.lclark.edu/nde/fulldisplay?docid="+this.docid+"&context="+this.context+"&vid="+this.vid+"&tab=default_tab&lang=en_US";
    return url;

  }

    getUrlParameter(parameterName: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        //console.log(urlParams.get(parameterName));
        return urlParams.get(parameterName);
    }



  doesLibraryOwn(deliv: any){
    //console.log(deliv);
   //console.log(deliv.delivery?.bestlocation?.organization);
    if(deliv?.delivery?.bestlocation !=null){
      if(this.instCode==deliv.delivery?.bestlocation?.organization){
        //console.log("match");
        return true;
      }
      else{
        //console.log("no match");
        return false;
      }

    }
    // possibly an ebook or article
    else{
      var availability=deliv?.delivery?.availability;
      var nr="not_restricted";
      return !!availability?.includes(nr);

    }

  }

  readonly dialog = inject(MatDialog);
/*
  openDialog() {
    const dialogRef = this.dialog.open(ReservesRequestDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);


      console.log("hello");
    });
    //need to get title, callNumber, author, location, permalink, availability, 




  }
    */
   openDialog() {
  const dialogRef = this.dialog.open(ReservesRequestDialog, {
    data: {
      title: this.title,
      author: this.author,
      callNumber: this.callNumber,
      location: this.location,
      availability: this.availability,
      permalink: this.getPermaLink()
    }
  });

  dialogRef.afterClosed().subscribe(formData => {
    if (formData) {
      const payload = {
        ...formData,
        ...dialogRef.componentInstance.data
      };

      console.log('Final payload:', payload);
      // send to external URL here
    }
  });
}






}



@Component({
  selector: 'reserves-request-dialog',
  templateUrl: 'reserves-request-dialog.html',
  standalone: true,
  styleUrl: './reserves-request.component.scss',
    imports: [
      CommonModule,
    FormsModule,
   // MatFormFieldModule,  // Add this
    MatInputModule ,
   // MatSelectModule ,
    MatDialogModule     // You'll likely need this too for input fields
  ],
})
/*
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
}*/

export class ReservesRequestDialog {

  dialogRef = inject(MatDialogRef<ReservesRequestDialog>);
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

      // 🔑 This sends data back to the opener
      this.dialogRef.close(this.courseDetails);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  
}

