import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldProductionComponent } from './field-production.component';

describe('FieldProductionComponent', () => {
  let component: FieldProductionComponent;
  let fixture: ComponentFixture<FieldProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
