import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'custom-report-problem',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './report-problem.component.html',
    styleUrls: ['./report-problem.component.scss']
})
export class ReportProblemComponent {

   // @Input() parentCtrl!: any; // The ! tells TypeScript: “I know this will be initialized before it's used.”


    docid: string | undefined;
    context: string | undefined;

    vid: string | null = this.getUrlParameter('vid');

    getUrlParameter(parameterName: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        //console.log(urlParams.get(parameterName));
        return urlParams.get(parameterName);
    }


    constructor(private store: Store, private el: ElementRef) { }

    ngOnInit() {
        this.store.select(selectFullDisplayRecord).subscribe((record) => {
            //console.log('Record:', record);

           // this.docid=record.origRecordId;
            //this.docid = record?.origRecordId; //doesn't work for all records
            this.docid = record?.pnx?.control?.recordid[0]; //works reliably

            //console.log(this.docid);
            this.context = record?.context;
            //this.vid=this.vid; //I guess redundant?
            
            const ndeSelector = 'nde-full-display-service-container-before-from-remote-0';
            // The actual NDE element this instance belongs to
            const hostNDE = this.el.nativeElement.closest(ndeSelector);
            //console.log(hostNDE);

            const allTargets = document.querySelectorAll(ndeSelector);

            const isFirst = (allTargets[0] === hostNDE);

            if (!isFirst) {
                //hides the ones that aren't first - element repeats
                hostNDE.style.display = 'none';
            }

 
        });
    }   
}