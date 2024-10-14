import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborInformationYearlyComponent } from './labor-information-yearly.component';

describe('LaborInformationYearlyComponent', () => {
  let component: LaborInformationYearlyComponent;
  let fixture: ComponentFixture<LaborInformationYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborInformationYearlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborInformationYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
