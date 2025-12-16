import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
//import {  HttpClient } from '@angular/common/http';



@Component({
    selector: 'custom-nde-mms-id-display',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './report-problem.component.html',
    styleUrls: ['./report-problem.component.scss']
})
export class ReportProblemComponent {

    @Input() parentCtrl!: any; // The ! tells TypeScript: “I know this will be initialized before it's used.”

    selectedRecordId: string | undefined;

    docid: string | undefined;


    izShow = true;
    nzShow = true;
    izLabel = 'Alma IZ Record No.';
    nzLabel = 'Alma NZ Record No.';
    izSuffix = '1452';
    instCode = '01ALLIANCE_UW';

    izMmsid: string | null = null;
    nzMmsid: string | null = null;

    constructor(private store: Store, private el: ElementRef) { }

    ngOnInit() {
        this.store.select(selectFullDisplayRecord).subscribe((record) => {
            console.log('Record:', record);

            this.docid=record.origRecordId;
            

            const pnx = record?.pnx?.control;
            console.log('PNX:', pnx);
            const pnxfull = record?.pnx?.addata?.url;
            console.log('PNX Full:', pnxfull);
            // Extract the source record ID from the record's PNX control field
           // const recordId = record?.pnx?.control?.sourcerecordid;
            //console.log(recordId);

 
            const ndeSelector = 'nde-full-display-service-container-before-from-remote-0';
            // The actual NDE element this instance belongs to
            const hostNDE = this.el.nativeElement.closest(ndeSelector);
            console.log(hostNDE);

            const allTargets = document.querySelectorAll(ndeSelector);

            const isFirst = (allTargets[0] === hostNDE);

            if (!isFirst) {
                hostNDE.style.display = 'none';
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
       /*
       
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
        });*/
    }
}