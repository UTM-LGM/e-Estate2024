import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRoleDetailComponent } from './pending-role-detail.component';

describe('PendingRoleDetailComponent', () => {
  let component: PendingRoleDetailComponent;
  let fixture: ComponentFixture<PendingRoleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingRoleDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRoleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
