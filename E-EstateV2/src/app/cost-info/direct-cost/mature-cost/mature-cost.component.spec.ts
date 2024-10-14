import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatureCostComponent } from './mature-cost.component';

describe('MatureCostComponent', () => {
  let component: MatureCostComponent;
  let fixture: ComponentFixture<MatureCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatureCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatureCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
