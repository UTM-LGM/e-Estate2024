import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateStatusComponent } from './estate-status.component';

describe('EstateStatusComponent', () => {
  let component: EstateStatusComponent;
  let fixture: ComponentFixture<EstateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstateStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
