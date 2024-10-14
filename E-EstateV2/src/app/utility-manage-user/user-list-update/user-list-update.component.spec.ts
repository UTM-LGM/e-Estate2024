import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListUpdateComponent } from './user-list-update.component';

describe('UserListUpdateComponent', () => {
  let component: UserListUpdateComponent;
  let fixture: ComponentFixture<UserListUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
