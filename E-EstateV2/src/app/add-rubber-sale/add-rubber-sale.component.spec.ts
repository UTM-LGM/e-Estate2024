import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRubberSaleComponent } from './add-rubber-sale.component';

describe('AddRubberSaleComponent', () => {
  let component: AddRubberSaleComponent;
  let fixture: ComponentFixture<AddRubberSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRubberSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRubberSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
