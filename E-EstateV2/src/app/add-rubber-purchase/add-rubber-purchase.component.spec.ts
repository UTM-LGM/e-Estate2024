import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRubberPurchaseComponent } from './add-rubber-purchase.component';

describe('AddRubberPurchaseComponent', () => {
  let component: AddRubberPurchaseComponent;
  let fixture: ComponentFixture<AddRubberPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRubberPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRubberPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
