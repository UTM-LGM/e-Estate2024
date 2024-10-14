import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuplumpRubberStockComponent } from './cuplump-rubber-stock.component';

describe('CuplumpRubberStockComponent', () => {
  let component: CuplumpRubberStockComponent;
  let fixture: ComponentFixture<CuplumpRubberStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuplumpRubberStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuplumpRubberStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
