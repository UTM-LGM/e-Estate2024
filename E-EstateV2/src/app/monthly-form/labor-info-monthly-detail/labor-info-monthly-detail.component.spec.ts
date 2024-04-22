import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborInfoMonthlyDetailComponent } from './labor-info-monthly-detail.component';

describe('LaborInfoMonthlyDetailComponent', () => {
  let component: LaborInfoMonthlyDetailComponent;
  let fixture: ComponentFixture<LaborInfoMonthlyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborInfoMonthlyDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborInfoMonthlyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
