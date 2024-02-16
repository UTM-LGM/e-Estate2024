import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubberSaleDetailComponent } from './rubber-sale-detail.component';

describe('RubberSaleDetailComponent', () => {
  let component: RubberSaleDetailComponent;
  let fixture: ComponentFixture<RubberSaleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubberSaleDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubberSaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
