import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEstateClerkComponent } from './home-estate-clerk.component';

describe('HomeEstateClerkComponent', () => {
  let component: HomeEstateClerkComponent;
  let fixture: ComponentFixture<HomeEstateClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEstateClerkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEstateClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
