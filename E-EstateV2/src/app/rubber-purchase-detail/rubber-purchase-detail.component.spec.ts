import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberPurchaseDetailComponent } from './rubber-purchase-detail.component';

describe('RubberPurchaseDetailComponent', () => {
  let component: RubberPurchaseDetailComponent;
  let fixture: ComponentFixture<RubberPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberPurchaseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
