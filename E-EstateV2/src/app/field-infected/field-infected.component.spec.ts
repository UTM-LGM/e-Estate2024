import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInfectedComponent } from './field-infected.component';

describe('FieldInfectedComponent', () => {
  let component: FieldInfectedComponent;
  let fixture: ComponentFixture<FieldInfectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldInfectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldInfectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
