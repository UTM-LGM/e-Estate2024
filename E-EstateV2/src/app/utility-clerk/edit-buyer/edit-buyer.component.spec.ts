import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuyerComponent } from './edit-buyer.component';

describe('EditBuyerComponent', () => {
  let component: EditBuyerComponent;
  let fixture: ComponentFixture<EditBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBuyerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
