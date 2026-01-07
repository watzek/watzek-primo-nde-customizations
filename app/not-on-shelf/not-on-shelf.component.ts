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

    instCode = '01ALLIANCE_LCC';


    izMmsid: string | null = null;
    nzMmsid: string | null = null;

    constructor(private store: Store, private http: HttpClient, @Inject(NOS_OPTIONS_TOKEN) private nosOptions: NosOptions) { }

    ngOnInit() {


        if (window.location.href.includes('fulldisplay')) {
            
            this.store.select(selectFullDisplayRecord).subscribe((record) => {
                console.log('Record:', record);
                const pnx = record?.pnx?.control;
                console.log('PNX:', pnx);
                const pnxfull = record?.pnx?.addata?.url;
                console.log('PNX Full:', pnxfull);
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
                    const location = mainLocation+" "+subLocation;
                    console.log(location);

                    console.log(mainLocation);
                    console.log(callNumber);
                    const urlBase = this.nosOptions[mainLocation][0].urlBase;
                    const qm = this.nosOptions[mainLocation][0].query_mappings[0];
                    console.log(urlBase);
                    console.log(qm);

                        const params = {
                        [qm.title]: title,
                        [qm.author]: author,
                        [qm.callnumber]: callNumber,
                        [qm.location]: location
                        };
                    this.url = this.buildUrl(urlBase, params);
                    this.nosShow = true;

                });




            if (Array.isArray(recordId) && typeof recordId[0] === 'string') {
                this.selectedRecordId = recordId[0];
            }
        });
        }
      







        console.log('Source Record ID:', this.selectedRecordId);


        //srcid is nz mmsid, implies no iz mmsid        
        /*
        if (this.selectedRecordId && this.selectedRecordId.startsWith('99') && !this.selectedRecordId.endsWith(this.izSuffix)) {
            this.nzShow = true;
            this.izShow = false;
            this.nzMmsid = this.selectedRecordId ?? null;


            //srcid is iz mmsid, check sru for nz mmsid
        }
        if (this.selectedRecordId && this.selectedRecordId.startsWith('99') && this.selectedRecordId.endsWith(this.izSuffix)) {
            this.izShow = true;
            this.izMmsid = this.selectedRecordId ?? null;
            this.sruCall(this.selectedRecordId);
        }

        //neither iz nor nz mmsid
        if (!this.selectedRecordId || !this.selectedRecordId.startsWith('99')) {
            this.nzShow = false;
            this.izShow = false;
        }

*/




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



private sruCall(mmsid: string): void {
        const url = `https://na01.alma.exlibrisgroup.com/view/sru/${this.instCode}?version=1.2&operation=searchRetrieve&query=alma.mms_id=${mmsid}`;
        console.log('SRU URL:', url);
        this.http.get(url, { responseType: 'text' }).subscribe(response => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response, 'text/xml');
            const fields = xmlDoc.getElementsByTagName('datafield');

            let found = false;
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (field.getAttribute('tag') === '035') {
                    const subfield = field.getElementsByTagName('subfield')[0]?.textContent;
                    if (subfield?.includes('(EXLNZ-01ALLIANCE_NETWORK)')) {
                        const pieces = subfield.split(')');
                        this.nzMmsid = pieces[1];
                        console.log('NZ MMSID:', this.nzMmsid);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                //this.nzShow = false;
            }
        });
    }



}
