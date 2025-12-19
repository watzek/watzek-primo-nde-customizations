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
  mainLocation: any | undefined;


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
            map(record => record?.pnx?.control?.recordid?.[0]),
            filter(Boolean),
            switchMap(docid =>
              this.store.select(selectDeliveryEntities).pipe(
                map(delivRecord => {
                  const recordDelivery = delivRecord?.[docid];

                  return {
                    delivery: recordDelivery,
                    mainLocation: recordDelivery?.delivery?.bestlocation?.mainLocation,
                    //links: recordDelivery?.links,
                    //locations: recordDelivery?.locations
                  };
                })
              )
            )
          )
          .subscribe(result => {
            this.deliv = result.delivery;
            console.log(this.deliv);
            this.mainLocation=result.mainLocation;
            console.log(this.mainLocation);
            //this.availability = result.availability;
            //this.links = result.links;
            //this.locations = result.locations;
          });

    }

}
