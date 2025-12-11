import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaaskChatwidgetComponent } from './slaask-chatwidget.component';

describe('SlaaskChatwidgetComponent', () => {
  let component: SlaaskChatwidgetComponent;
  let fixture: ComponentFixture<SlaaskChatwidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaaskChatwidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlaaskChatwidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
