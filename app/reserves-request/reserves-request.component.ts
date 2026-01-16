import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
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
  

  constructor(private store: Store<any>) {}

  ngOnInit() {
    
    //for user details
    this.store.select('user').subscribe(user => {
      if (!user?.jwt) return;
      console.log('USER STATE:', user);
      let isLoggedIn=user?.isLoggedIn;

      const decodedJwt = JSON.parse(atob(user.jwt.split('.')[1]));
      const userGroup = decodedJwt?.userGroup;
      console.log(userGroup);

      //for pnx details
      this.store.select(selectFullDisplayRecord).subscribe((record) => {
        this.docid= record?.pnx?.control?.recordid?.[0];
        

        var pieces=this.docid.split("_");
        this.isCdi=pieces.includes("cdi");

        if(this.isCdi==true){this.context="PC";}
        else{this.context="L";}

        var format=record?.pnx.display.type[0];
        var formatCheck = this.formatDenyList.indexOf(format);
          
        if (formatCheck >= 0) {
          this.validFormat = false;
        } else {
          this.validFormat = true;
        }
        this.title = record?.pnx?.display?.title?.[0];
        this.author = record?.pnx?.addata?.au?.[0];

        //for delivery details
        this.store.select(selectDeliveryEntities).subscribe((deliv) => {
          const recordDelivery = deliv?.[this.docid];
          console.log(recordDelivery);
          const bestLocation= recordDelivery?.delivery?.bestlocation;
          this.libraryOwns=this.doesLibraryOwn(recordDelivery);
          console.log(this.libraryOwns);

          //callNumber lookup should depend on delivery category
          var dCat=recordDelivery?.delivery?.deliveryCategory;
          console.log(dCat);
          console.log(dCat.indexOf("Alma-E"));
          if(dCat.indexOf("Alma-E")>0){
            this.delivCat="Alma-E";
            this.callNumber="N/A";
            this.location="Electronic Resource";
            this.availability="Electronic";
          }
          if(dCat[0]=="Alma-P" && dCat.length==1){
            this.delivCat="Alma-P";
            if(recordDelivery?.delivery?.bestlocation==null){
              this.location="N/A";
              this.availability="N/A";
            }
            else{
              var mainLocation=recordDelivery?.delivery?.bestlocation.mainLocation;
              var subLocation=recordDelivery?.delivery?.bestlocation.subLocation;
              this.location=mainLocation+" "+subLocation;
              console.log(this.location);
              this.availability=recordDelivery?.delivery?.bestlocation?.availabilityStatus;
            }


            this.callNumber = recordDelivery?.delivery?.bestlocation?.callNumber;
            if (!this.callNumber) {
              // Delivery data not ready yet → do nothing
              return;
            }


          }


          //this.callNumber = recordDelivery?.delivery?.bestlocation?.callNumber;

                    // this functions to wait until callNumber is available before proceeding

          console.log(this.callNumber);


        });


      });

      if (['2', '3'].includes(String(userGroup))) { //only displays if user is member of Alma groups 2 or 3 (Fac or Staff)
        this.validUser=true;
        
      }
      else{
        this.validUser=false;
      }


      if(this.validUser==true && this.validFormat==true && (this.isCdi==true || (this.isCdi==false && this.libraryOwns==true))){
        this.reservesRequestShow = true;
        console.log("conditions met for reserves request:");
        console.log("validUser:"+this.validUser+", validFormat:"+this.validFormat+", isCdi:"+this.isCdi+", libraryOwns:"+this.libraryOwns);

      }
      else{
        console.log("conditions not met for reserves request:");
        console.log("validUser:"+this.validUser+", validFormat:"+this.validFormat+", isCdi:"+this.isCdi+", libraryOwns:"+this.libraryOwns);
      }
      



    });
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
      var eAvail=availability.indexOf(nr);

      if(eAvail > -1){return true;}
      else{return false;}

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

