import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCostInformationComponent } from './report-cost-information.component';

describe('ReportCostInformationComponent', () => {
  let component: ReportCostInformationComponent;
  let fixture: ComponentFixture<ReportCostInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCostInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCostInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
