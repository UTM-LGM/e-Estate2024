import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberSalesComponent } from './rubber-sales.component';

describe('RubberSalesComponent', () => {
  let component: RubberSalesComponent;
  let fixture: ComponentFixture<RubberSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
