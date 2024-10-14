import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropCategoryComponent } from './crop-category.component';

describe('CropCategoryComponent', () => {
  let component: CropCategoryComponent;
  let fixture: ComponentFixture<CropCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
