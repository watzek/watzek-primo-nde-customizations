import { Component, OnInit } from '@angular/core';
declare var _slaask: any;

@Component({
  selector: 'custom-slaask-chatwidget',
  standalone: true,
  imports: [],
  templateUrl: './slaask-chatwidget.component.html',
  styleUrl: './slaask-chatwidget.component.scss'
})
export class SlaaskChatwidgetComponent {
  ngOnInit(): void {
    // Check if script is already added
    if (!document.querySelector('script[src*="slaask.js"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://libapps.s3.amazonaws.com/sites/5089/include/slaask.js';
      script.onload = () => {
        // Wait for the script to load before initializing
        if (window.hasOwnProperty('_slaask')) {
          (_slaask as any).init('295dd444a1af2c9ab3456b7da45a415a');
        }
      };
      document.head.appendChild(script);
    } else {
      // Script already exists, just init again
      (_slaask as any).init('295dd444a1af2c9ab3456b7da45a415a');
    }
  }

}
