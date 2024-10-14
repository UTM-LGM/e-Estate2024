import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborForeignerDetailComponent } from './labor-foreigner-detail.component';

describe('LaborForeignerDetailComponent', () => {
  let component: LaborForeignerDetailComponent;
  let fixture: ComponentFixture<LaborForeignerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborForeignerDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborForeignerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
