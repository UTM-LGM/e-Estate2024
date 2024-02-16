import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborForeignerComponent } from './labor-foreigner.component';

describe('LaborForeignerComponent', () => {
  let component: LaborForeignerComponent;
  let fixture: ComponentFixture<LaborForeignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborForeignerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborForeignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
