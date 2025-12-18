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
  

  hoursText: string | null = null;
  error = false;


  private hoursUrl =
    'https://libcal.lclark.edu/api_hours_today.php?iid=3636&lid=4016&format=json';

  constructor(private http: HttpClient) {}
  

    ngOnInit() {
      /*
    this.http.get<any>(this.hoursUrl).subscribe({
      next: (data) => {
        this.hoursText = data?.locations?.[0]?.rendered ?? 'Hours unavailable';
      },
      error: () => {
        this.error = true;
      }
    });
    */
  }
  

}
