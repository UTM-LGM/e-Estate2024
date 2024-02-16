import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityClerkComponent } from './utility-clerk.component';

describe('UtilityClerkComponent', () => {
  let component: UtilityClerkComponent;
  let fixture: ComponentFixture<UtilityClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilityClerkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
