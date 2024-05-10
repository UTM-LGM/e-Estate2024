import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProductionByYearComponent } from './report-production-by-year.component';

describe('ReportProductionByYearComponent', () => {
  let component: ReportProductionByYearComponent;
  let fixture: ComponentFixture<ReportProductionByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportProductionByYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportProductionByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
