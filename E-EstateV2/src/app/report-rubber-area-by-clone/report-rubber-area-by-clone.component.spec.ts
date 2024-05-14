import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRubberAreaByCloneComponent } from './report-rubber-area-by-clone.component';

describe('ReportRubberAreaByCloneComponent', () => {
  let component: ReportRubberAreaByCloneComponent;
  let fixture: ComponentFixture<ReportRubberAreaByCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRubberAreaByCloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRubberAreaByCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
