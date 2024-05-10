import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneProductivityYearlyComponent } from './clone-productivity-yearly.component';

describe('CloneProductivityYearlyComponent', () => {
  let component: CloneProductivityYearlyComponent;
  let fixture: ComponentFixture<CloneProductivityYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneProductivityYearlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneProductivityYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
