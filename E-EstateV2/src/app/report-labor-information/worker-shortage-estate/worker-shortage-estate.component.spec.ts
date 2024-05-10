import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerShortageEstateComponent } from './worker-shortage-estate.component';

describe('WorkerShortageEstateComponent', () => {
  let component: WorkerShortageEstateComponent;
  let fixture: ComponentFixture<WorkerShortageEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerShortageEstateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerShortageEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
