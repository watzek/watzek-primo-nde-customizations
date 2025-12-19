import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotOnShelfComponent } from './not-on-shelf.component';

describe('NotOnShelfComponent', () => {
  let component: NotOnShelfComponent;
  let fixture: ComponentFixture<NotOnShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotOnShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotOnShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
