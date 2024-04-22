import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerShortageDetailComponent } from './worker-shortage-detail.component';

describe('WorkerShortageDetailComponent', () => {
  let component: WorkerShortageDetailComponent;
  let fixture: ComponentFixture<WorkerShortageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerShortageDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerShortageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
