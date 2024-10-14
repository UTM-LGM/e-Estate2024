import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberStockDetailComponent } from './rubber-stock-detail.component';

describe('RubberStockDetailComponent', () => {
  let component: RubberStockDetailComponent;
  let fixture: ComponentFixture<RubberStockDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberStockDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberStockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
