import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerShortageComponent } from './worker-shortage.component';

describe('WorkerShortageComponent', () => {
  let component: WorkerShortageComponent;
  let fixture: ComponentFixture<WorkerShortageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerShortageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
