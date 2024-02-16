import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompanyAdminComponent } from './home-company-admin.component';

describe('HomeCompanyAdminComponent', () => {
  let component: HomeCompanyAdminComponent;
  let fixture: ComponentFixture<HomeCompanyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCompanyAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCompanyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
