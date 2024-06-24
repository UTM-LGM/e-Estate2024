import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRubberSaleComponent } from './report-rubber-sale.component';

describe('ReportRubberSaleComponent', () => {
  let component: ReportRubberSaleComponent;
  let fixture: ComponentFixture<ReportRubberSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRubberSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRubberSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
