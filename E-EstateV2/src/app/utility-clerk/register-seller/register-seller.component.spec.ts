import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSellerComponent } from './register-seller.component';

describe('RegisterSellerComponent', () => {
  let component: RegisterSellerComponent;
  let fixture: ComponentFixture<RegisterSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
