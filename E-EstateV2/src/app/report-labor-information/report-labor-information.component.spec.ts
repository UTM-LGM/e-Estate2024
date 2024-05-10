import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLaborInformationComponent } from './report-labor-information.component';

describe('ReportLaborInformationComponent', () => {
  let component: ReportLaborInformationComponent;
  let fixture: ComponentFixture<ReportLaborInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportLaborInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLaborInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
