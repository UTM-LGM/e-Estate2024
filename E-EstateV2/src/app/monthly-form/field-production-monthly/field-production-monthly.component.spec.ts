import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldProductionMonthlyComponent } from './field-production-monthly.component';

describe('FieldProductionMonthlyComponent', () => {
  let component: FieldProductionMonthlyComponent;
  let fixture: ComponentFixture<FieldProductionMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldProductionMonthlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldProductionMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
