import {selectDeliveryEntities} from '../utils/DeliveryRecordSelector';
import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import { Component, Input, OnInit, ElementRef, InjectionToken, Inject } from '@angular/core';
import {Store} from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {NosOptions, NOS_OPTIONS} from './nos-options.config';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export const NOS_OPTIONS_TOKEN =
  new InjectionToken<NosOptions>('NOS_OPTIONS');

///note HttpClientModule works on my laptop (Angular v18.2.8), but not at work



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
    selectedRecordId: string | undefined;
    url: string | undefined;
    mainLocation: any | undefined;
    nosShow = false;

    constructor(private store: Store, private http: HttpClient, @Inject(NOS_OPTIONS_TOKEN) private nosOptions: NosOptions) { }

    ngOnInit() {

        // only works on fulldisplay
        if (window.location.href.includes('fulldisplay')) {
            
            this.store.select(selectFullDisplayRecord).subscribe((record) => {
                console.log('Record:', record);

                // Extract the source record ID from the record's PNX control field
                const recordId = record?.pnx?.control?.sourcerecordid;
                const docid= record?.pnx?.control?.recordid?.[0];
                const title = record?.pnx?.display?.title?.[0];
                const author = record?.pnx?.addata?.au?.[0];

                this.store.select(selectDeliveryEntities).subscribe((deliv) => {
                    console.log('Record:', deliv);
                    const recordDelivery = deliv?.[docid];
                    const mainLocation= recordDelivery?.delivery?.bestlocation?.mainLocation
                    const subLocation = recordDelivery?.delivery?.bestlocation?.subLocation;
                    const callNumber = recordDelivery?.delivery?.bestlocation?.callNumber;

                    // this functions to wait until callNumber is available before proceeding
                    if (!callNumber) {
                        // Delivery data not ready yet → do nothing
                        return;
                    }
                    
                    
                    const location = mainLocation+" "+subLocation;
                    const urlBase = this.nosOptions[mainLocation][0].urlBase;
                    const qm = this.nosOptions[mainLocation][0].query_mappings[0];
                    const params = {
                        [qm.title]: title,
                        [qm.author]: author,
                        [qm.callnumber]: callNumber,
                        [qm.location]: location
                    };
                    this.url = this.buildUrl(urlBase, params);
                    if(this.url){
                        this.nosShow = true;
                    }
                    

                });

        });
        }
      

      }

        buildUrl(url: string, params: Record<string, string | undefined>): string {
            const searchParams = new URLSearchParams();

            Object.entries(params).forEach(([key, value]) => {
                if (value != null) {
                searchParams.set(key, value);
                }
            });

            const queryString = searchParams.toString();

            return queryString
                ? `${url}${url.includes('?') ? '&' : '?'}${queryString}`
                : url;
        }




}
