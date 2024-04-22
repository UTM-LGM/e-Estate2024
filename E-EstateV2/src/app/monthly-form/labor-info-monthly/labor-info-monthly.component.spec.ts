import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborInfoMonthlyComponent } from './labor-info-monthly.component';

describe('LaborInfoMonthlyComponent', () => {
  let component: LaborInfoMonthlyComponent;
  let fixture: ComponentFixture<LaborInfoMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborInfoMonthlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborInfoMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
