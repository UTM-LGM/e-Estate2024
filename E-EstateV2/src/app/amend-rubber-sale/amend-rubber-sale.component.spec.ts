import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendRubberSaleComponent } from './amend-rubber-sale.component';

describe('AmendRubberSaleComponent', () => {
  let component: AmendRubberSaleComponent;
  let fixture: ComponentFixture<AmendRubberSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendRubberSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmendRubberSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
