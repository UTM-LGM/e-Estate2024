import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborLocalComponent } from './labor-local.component';

describe('LaborLocalComponent', () => {
  let component: LaborLocalComponent;
  let fixture: ComponentFixture<LaborLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborLocalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
