import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAndConversationsComponent } from './users-and-conversations.component';

describe('UsersAndConversationsComponent', () => {
  let component: UsersAndConversationsComponent;
  let fixture: ComponentFixture<UsersAndConversationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAndConversationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAndConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
