import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import {selectDeliveryEntities} from '../utils/DeliveryRecordSelector';
import { Component, Input, OnInit, ElementRef, InjectionToken, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, filter, switchMap } from 'rxjs/operators';
import {NosOptions, NOS_OPTIONS} from './nos-options.config';

export const NOS_OPTIONS_TOKEN =
  new InjectionToken<NosOptions>('NOS_OPTIONS');

@Component({
  selector: 'custom-not-on-shelf',
  standalone: true,
  imports: [],
  templateUrl: './not-on-shelf.component.html',
  styleUrl: './not-on-shelf.component.scss',
  providers: [
    { provide: NOS_OPTIONS_TOKEN, useValue: NOS_OPTIONS }
  ]
})


export class NotOnShelfComponent {
  docid: string | undefined;
  deliv: any | undefined;
  title: string | undefined;
  author: string | undefined;
  callNumber: string | undefined;
  mainLocation: any | undefined;
  url: string | undefined;
  record: any | undefined;
  
  nosShow= false;


   constructor(
    private store: Store, 
    private el: ElementRef,
    @Inject(NOS_OPTIONS_TOKEN) private nosOptions: NosOptions 
    //makes this.nosOptions available to class
    ) { }


    ngOnInit() {
      const isFullDisplay =
        window.location.pathname.includes('fulldisplay') ||
        new URLSearchParams(window.location.search).has('docid');

      if (!isFullDisplay) {
        this.el.nativeElement.style.display = 'none';
      }

        this.store
          .select(selectFullDisplayRecord)
          .pipe(
            filter(record => !!record),
            map(record => ({
              record,
              docid: record?.pnx?.control?.recordid?.[0]
            })),
            filter(({ docid }) => !!docid),
            switchMap(({ record, docid }) =>
              this.store.select(selectDeliveryEntities).pipe(
                map(delivRecord => {
                  const recordDelivery = delivRecord?.[docid];

                  return {
                    record,
                    docid,
                    delivery: recordDelivery,
                    mainLocation:
                      recordDelivery?.delivery?.bestlocation?.mainLocation
                  };
                })
              )
            )
          )
          .subscribe(result => {
            this.record = result.record;
            this.docid = result.docid;
            this.deliv = result.delivery;
            this.mainLocation = result.mainLocation;

            if (this.nosOptions[this.mainLocation]) {
              this.title=this.record?.pnx?.display?.title[0];
              this.author=this.record?.pnx?.addata?.au[0];
              this.callNumber=this.record?.enrichment?.virtualBrowseObject?.callNumber;
              this.nosShow = true;
              console.log(this.record);
              console.log(this.title);
            }
          });


    }

}
