import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReceiptComponent } from './generate-receipt.component';

describe('GenerateReceiptComponent', () => {
  let component: GenerateReceiptComponent;
  let fixture: ComponentFixture<GenerateReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
