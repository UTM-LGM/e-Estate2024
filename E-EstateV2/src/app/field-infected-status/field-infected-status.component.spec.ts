import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInfectedStatusComponent } from './field-infected-status.component';

describe('FieldInfectedStatusComponent', () => {
  let component: FieldInfectedStatusComponent;
  let fixture: ComponentFixture<FieldInfectedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldInfectedStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldInfectedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
