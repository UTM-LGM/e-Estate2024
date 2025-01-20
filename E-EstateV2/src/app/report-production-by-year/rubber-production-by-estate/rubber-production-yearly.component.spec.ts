import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberProductionYearlyComponent } from './rubber-production-yearly.component';

describe('RubberProductionYearlyComponent', () => {
  let component: RubberProductionYearlyComponent;
  let fixture: ComponentFixture<RubberProductionYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberProductionYearlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberProductionYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
