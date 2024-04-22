import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRubberStockComponent } from './add-rubber-stock.component';

describe('AddRubberStockComponent', () => {
  let component: AddRubberStockComponent;
  let fixture: ComponentFixture<AddRubberStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRubberStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRubberStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
