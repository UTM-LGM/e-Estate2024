import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberProductionYearComponent } from './rubber-production-year.component';

describe('RubberProductionYearComponent', () => {
  let component: RubberProductionYearComponent;
  let fixture: ComponentFixture<RubberProductionYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberProductionYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberProductionYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
