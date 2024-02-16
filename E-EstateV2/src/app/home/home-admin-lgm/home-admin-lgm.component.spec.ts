import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAdminLGMComponent } from './home-admin-lgm.component';

describe('HomeAdminLGMComponent', () => {
  let component: HomeAdminLGMComponent;
  let fixture: ComponentFixture<HomeAdminLGMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAdminLGMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAdminLGMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
