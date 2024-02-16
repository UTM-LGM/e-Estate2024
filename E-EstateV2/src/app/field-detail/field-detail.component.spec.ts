import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldDetailComponent } from './field-detail.component';

describe('FieldDetailComponent', () => {
  let component: FieldDetailComponent;
  let fixture: ComponentFixture<FieldDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
