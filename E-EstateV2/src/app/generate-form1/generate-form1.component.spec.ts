import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateForm1Component } from './generate-form1.component';

describe('GenerateForm1Component', () => {
  let component: GenerateForm1Component;
  let fixture: ComponentFixture<GenerateForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateForm1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
