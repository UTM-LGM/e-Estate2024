import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProductivityByYearComponent } from './report-productivity-by-year.component';

describe('ReportProductivityByYearComponent', () => {
  let component: ReportProductivityByYearComponent;
  let fixture: ComponentFixture<ReportProductivityByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportProductivityByYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportProductivityByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
