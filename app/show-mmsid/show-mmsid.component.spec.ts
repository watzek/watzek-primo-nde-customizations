import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMmsidComponent } from './show-mmsid.component';

describe('ShowMmsidComponent', () => {
  let component: ShowMmsidComponent;
  let fixture: ComponentFixture<ShowMmsidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMmsidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMmsidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
