import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryCardsComponent } from './library-cards.component';

describe('LibraryCardsComponent', () => {
  let component: LibraryCardsComponent;
  let fixture: ComponentFixture<LibraryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
