import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityManageUserComponent } from './utility-manage-user.component';

describe('UtilityManageUserComponent', () => {
  let component: UtilityManageUserComponent;
  let fixture: ComponentFixture<UtilityManageUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilityManageUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
