import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberStockComponent } from './rubber-stock.component';

describe('RubberStockComponent', () => {
  let component: RubberStockComponent;
  let fixture: ComponentFixture<RubberStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
