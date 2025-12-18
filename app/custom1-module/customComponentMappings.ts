// import additional custom modules

import {SlaaskChatwidgetComponent} from '../slaask-chatwidget/slaask-chatwidget.component';
import {ReportProblemComponent} from '../report-problem/report-problem.component';
import {ShowMmsidComponent} from '../show-mmsid/show-mmsid.component';
import {LibraryCardsComponent} from '../library-cards/library-cards.component';



// Now map them
export const selectorComponentMap = new Map<string, any>([

    ['nde-footer-after', SlaaskChatwidgetComponent],
    ['nde-full-display-service-container-before', ReportProblemComponent],
    ['nde-full-display-details-after', ShowMmsidComponent],
    ['nde-landing-page-before', LibraryCardsComponent]

   


]);
