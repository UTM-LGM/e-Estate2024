import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaByCloneComponent } from './area-by-clone.component';

describe('AreaByCloneComponent', () => {
  let component: AreaByCloneComponent;
  let fixture: ComponentFixture<AreaByCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaByCloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaByCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
