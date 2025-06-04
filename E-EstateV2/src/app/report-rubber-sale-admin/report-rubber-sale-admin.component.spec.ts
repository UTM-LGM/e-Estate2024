import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRubberSaleAdminComponent } from './report-rubber-sale-admin.component';

describe('ReportRubberSaleAdminComponent', () => {
  let component: ReportRubberSaleAdminComponent;
  let fixture: ComponentFixture<ReportRubberSaleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRubberSaleAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRubberSaleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
