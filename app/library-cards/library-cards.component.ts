import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'custom-library-cards',
  standalone: true,
  imports: [],
  templateUrl: './library-cards.component.html',
  styleUrl: './library-cards.component.scss'
})
export class LibraryCardsComponent {
  

  watzekHoursText: string | null = null;
  boleyHoursText: string | null = null;
  error = false;


  private watzekHoursUrl =
    'https://libcal.lclark.edu/api_hours_today.php?iid=3636&lid=4016&format=json';

  private boleyHoursUrl=  
    'https://lawlib.lclark.libcal.com/api_hours_today.php?lid=1768&format=json&systemTime=0';

  constructor(private http: HttpClient) {}
  

    ngOnInit() {
      
    this.http.get<any>(this.watzekHoursUrl).subscribe({
      next: (data) => {
        this.watzekHoursText = data?.locations?.[0]?.rendered ?? 'Hours unavailable';
      },
      error: () => {
        this.error = true;
      }
    });

    this.http.get<any>(this.boleyHoursUrl).subscribe({
      next: (data) => {
        console.log(data);
        this.boleyHoursText = data?.locations?.[1]?.rendered ?? 'Hours unavailable';
      },
      error: () => {
        this.error = true;
      }
    });

    
  }
  

}
