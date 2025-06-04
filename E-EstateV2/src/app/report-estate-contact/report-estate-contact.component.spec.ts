import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEstateContactComponent } from './report-estate-contact.component';

describe('ReportEstateContactComponent', () => {
  let component: ReportEstateContactComponent;
  let fixture: ComponentFixture<ReportEstateContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportEstateContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportEstateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
