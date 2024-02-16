import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyDetailComponent } from './edit-company-detail.component';

describe('EditCompanyDetailComponent', () => {
  let component: EditCompanyDetailComponent;
  let fixture: ComponentFixture<EditCompanyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCompanyDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
