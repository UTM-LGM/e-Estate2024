import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldProductionYearlyReportComponent } from './yield-production-yearly-report.component';

describe('YieldProductionYearlyReportComponent', () => {
  let component: YieldProductionYearlyReportComponent;
  let fixture: ComponentFixture<YieldProductionYearlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YieldProductionYearlyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YieldProductionYearlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
