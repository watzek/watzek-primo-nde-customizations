import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import { Component, Input } from '@angular/core';
import {Store} from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

///note HttpClientModule works on my laptop (Angular v18.2.8), but not at work


@Component({
  selector: 'custom-show-mmsid',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './show-mmsid.component.html',
  styleUrl: './show-mmsid.component.scss'
})
export class ShowMmsidComponent {

    selectedRecordId: string | undefined;

    izShow = true;
    nzShow = true;
    izLabel = 'MMS ID (IZ)';
    nzLabel = 'MMS ID (NZ)';
    izSuffix = '1844';
    instCode = '01ALLIANCE_LCC';


    izMmsid: string | null = null;
    nzMmsid: string | null = null;

    constructor(private store: Store, private http: HttpClient) { }

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

        console.log('Source Record ID:', this.selectedRecordId);
        /*         if (this.selectedRecordId && this.selectedRecordId.startsWith('99')) {
                    this.izShow = true;
                    this.nzShow = true;
                } */

        //srcid is nz mmsid, implies no iz mmsid        
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
                this.nzShow = false;
            }
        });
    }



}
