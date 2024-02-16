import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborLocalDetailComponent } from './labor-local-detail.component';

describe('LaborLocalDetailComponent', () => {
  let component: LaborLocalDetailComponent;
  let fixture: ComponentFixture<LaborLocalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborLocalDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborLocalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
