import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEstateDetailComponent } from './edit-estate-detail.component';

describe('EditEstateDetailComponent', () => {
  let component: EditEstateDetailComponent;
  let fixture: ComponentFixture<EditEstateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEstateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEstateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
