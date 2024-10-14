import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldProductionDetailComponent } from './field-production-detail.component';

describe('FieldProductionDetailComponent', () => {
  let component: FieldProductionDetailComponent;
  let fixture: ComponentFixture<FieldProductionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldProductionDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldProductionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
