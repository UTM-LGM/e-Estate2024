import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstateComponent } from './add-estate.component';

describe('AddEstateComponent', () => {
  let component: AddEstateComponent;
  let fixture: ComponentFixture<AddEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEstateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
