import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRequestDialogComponent } from './chat-request-dialog.component';

describe('ChatRequestDialogComponent', () => {
  let component: ChatRequestDialogComponent;
  let fixture: ComponentFixture<ChatRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
