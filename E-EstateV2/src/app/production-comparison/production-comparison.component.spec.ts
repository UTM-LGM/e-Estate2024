import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionComparisonComponent } from './production-comparison.component';

describe('ProductionComparisonComponent', () => {
  let component: ProductionComparisonComponent;
  let fixture: ComponentFixture<ProductionComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionComparisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
