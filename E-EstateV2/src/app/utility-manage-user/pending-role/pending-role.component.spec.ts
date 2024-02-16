import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRoleComponent } from './pending-role.component';

describe('PendingRoleComponent', () => {
  let component: PendingRoleComponent;
  let fixture: ComponentFixture<PendingRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
