// import additional custom modules

import {SlaaskChatwidgetComponent} from '../slaask-chatwidget/slaask-chatwidget.component';
import {ReportProblemComponent} from '../report-problem/report-problem.component';


// Now map them
export const selectorComponentMap = new Map<string, any>([

    ['nde-footer-after', SlaaskChatwidgetComponent],
    ['nde-full-display-service-container-before', ReportProblemComponent]



]);
