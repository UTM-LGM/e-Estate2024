import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborInformationComponent } from './local-labor-type.component';

describe('LaborInformationComponent', () => {
  let component: LaborInformationComponent;
  let fixture: ComponentFixture<LaborInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
