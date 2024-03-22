import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantingMaterialComponent } from './planting-material.component';

describe('PlantingMaterialComponent', () => {
  let component: PlantingMaterialComponent;
  let fixture: ComponentFixture<PlantingMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantingMaterialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantingMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
