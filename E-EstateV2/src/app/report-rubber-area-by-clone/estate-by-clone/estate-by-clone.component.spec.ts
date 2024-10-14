import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateByCloneComponent } from './estate-by-clone.component';

describe('EstateByCloneComponent', () => {
  let component: EstateByCloneComponent;
  let fixture: ComponentFixture<EstateByCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstateByCloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstateByCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
