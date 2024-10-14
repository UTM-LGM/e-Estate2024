import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberPurchaseComponent } from './rubber-purchase.component';

describe('RubberPurchaseComponent', () => {
  let component: RubberPurchaseComponent;
  let fixture: ComponentFixture<RubberPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
