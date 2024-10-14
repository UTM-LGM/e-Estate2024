import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberCropsByStateComponent } from './rubber-crops-by-state.component';

describe('RubberCropsByStateComponent', () => {
  let component: RubberCropsByStateComponent;
  let fixture: ComponentFixture<RubberCropsByStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberCropsByStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberCropsByStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
