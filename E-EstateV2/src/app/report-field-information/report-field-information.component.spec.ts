import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFieldInformationComponent } from './report-field-information.component';

describe('ReportFieldInformationComponent', () => {
  let component: ReportFieldInformationComponent;
  let fixture: ComponentFixture<ReportFieldInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFieldInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFieldInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
