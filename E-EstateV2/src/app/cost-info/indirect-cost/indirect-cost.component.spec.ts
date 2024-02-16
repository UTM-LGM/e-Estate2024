import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectCostComponent } from './indirect-cost.component';

describe('IndirectCostComponent', () => {
  let component: IndirectCostComponent;
  let fixture: ComponentFixture<IndirectCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndirectCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndirectCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
