import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInfoYearlyComponent } from './field-info-yearly.component';

describe('FieldInfoYearlyComponent', () => {
  let component: FieldInfoYearlyComponent;
  let fixture: ComponentFixture<FieldInfoYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldInfoYearlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldInfoYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
