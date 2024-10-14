import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmatureCostComponent } from './immature-cost.component';

describe('ImmatureCostComponent', () => {
  let component: ImmatureCostComponent;
  let fixture: ComponentFixture<ImmatureCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImmatureCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmatureCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
