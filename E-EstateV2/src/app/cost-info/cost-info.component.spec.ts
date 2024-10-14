import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostInfoComponent } from './cost-info.component';

describe('CostInfoComponent', () => {
  let component: CostInfoComponent;
  let fixture: ComponentFixture<CostInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
