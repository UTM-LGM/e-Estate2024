import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborInfoComponent } from './labor-info.component';

describe('LaborInfoComponent', () => {
  let component: LaborInfoComponent;
  let fixture: ComponentFixture<LaborInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
