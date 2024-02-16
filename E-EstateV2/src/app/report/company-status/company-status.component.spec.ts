import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStatusComponent } from './company-status.component';

describe('CompanyStatusComponent', () => {
  let component: CompanyStatusComponent;
  let fixture: ComponentFixture<CompanyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
