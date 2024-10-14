import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TappingSystemComponent } from './tapping-system.component';

describe('TappingSystemComponent', () => {
  let component: TappingSystemComponent;
  let fixture: ComponentFixture<TappingSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TappingSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TappingSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
