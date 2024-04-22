import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInfectedDetailComponent } from './field-infected-detail.component';

describe('FieldInfectedDetailComponent', () => {
  let component: FieldInfectedDetailComponent;
  let fixture: ComponentFixture<FieldInfectedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldInfectedDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldInfectedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
