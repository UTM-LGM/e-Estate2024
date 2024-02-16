import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalLaborTypeComponent } from './local-labor-type.component';

describe('LocalLaborTypeComponent', () => {
  let component: LocalLaborTypeComponent;
  let fixture: ComponentFixture<LocalLaborTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalLaborTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalLaborTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
