import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservesRequestComponent } from './reserves-request.component';

describe('ReservesRequestComponent', () => {
  let component: ReservesRequestComponent;
  let fixture: ComponentFixture<ReservesRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservesRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
