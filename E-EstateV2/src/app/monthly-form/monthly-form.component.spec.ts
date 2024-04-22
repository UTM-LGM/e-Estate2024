import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFormComponent } from './monthly-form.component';

describe('MonthlyFormComponent', () => {
  let component: MonthlyFormComponent;
  let fixture: ComponentFixture<MonthlyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
