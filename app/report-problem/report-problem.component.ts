import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'custom-report-problem',
  standalone: true,
  imports: [],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.scss'
})
export class ReportProblemComponent {

  constructor(private el: ElementRef) {}

  ngOnInit(){

    const ndeSelector = 'nde-full-display-service-container-before-from-remote-0';
    // The actual NDE element this instance belongs to
    const hostNDE = this.el.nativeElement.closest(ndeSelector);

    const allTargets = document.querySelectorAll(ndeSelector);

    const isFirst = (allTargets[0] === hostNDE);

    if (!isFirst) {
      hostNDE.style.display = 'none';
    }


  }

}
