import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostItemComponent } from './cost-item.component';

describe('CostItemComponent', () => {
  let component: CostItemComponent;
  let fixture: ComponentFixture<CostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
