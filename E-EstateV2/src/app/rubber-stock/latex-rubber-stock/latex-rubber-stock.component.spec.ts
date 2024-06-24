import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexRubberStockComponent } from './latex-rubber-stock.component';

describe('LatexRubberStockComponent', () => {
  let component: LatexRubberStockComponent;
  let fixture: ComponentFixture<LatexRubberStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatexRubberStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatexRubberStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
