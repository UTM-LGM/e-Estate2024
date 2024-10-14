import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldDiseaseComponent } from './field-disease.component';

describe('FieldDiseaseComponent', () => {
  let component: FieldDiseaseComponent;
  let fixture: ComponentFixture<FieldDiseaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldDiseaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
