import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedRoomComponent } from './joined-room.component';

describe('JoinedRoomComponent', () => {
  let component: JoinedRoomComponent;
  let fixture: ComponentFixture<JoinedRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinedRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinedRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
