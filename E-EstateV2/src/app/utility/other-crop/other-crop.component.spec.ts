import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCropComponent } from './other-crop.component';

describe('OtherCropComponent', () => {
  let component: OtherCropComponent;
  let fixture: ComponentFixture<OtherCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherCropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
