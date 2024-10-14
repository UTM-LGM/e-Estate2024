import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHierarchyComponent } from './edit-hierarchy.component';

describe('EditHierarchyComponent', () => {
  let component: EditHierarchyComponent;
  let fixture: ComponentFixture<EditHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHierarchyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
