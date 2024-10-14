import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneProductionYearlyComponent } from './clone-production-yearly.component';

describe('CloneProductionYearlyComponent', () => {
  let component: CloneProductionYearlyComponent;
  let fixture: ComponentFixture<CloneProductionYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneProductionYearlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneProductionYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
