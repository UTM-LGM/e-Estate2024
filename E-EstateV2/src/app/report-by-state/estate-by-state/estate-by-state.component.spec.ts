import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateByStateComponent } from './estate-by-state.component';

describe('EstateByStateComponent', () => {
  let component: EstateByStateComponent;
  let fixture: ComponentFixture<EstateByStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstateByStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstateByStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
