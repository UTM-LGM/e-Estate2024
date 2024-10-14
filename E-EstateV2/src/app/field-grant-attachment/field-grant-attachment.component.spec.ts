import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldGrantAttachmentComponent } from './field-grant-attachment.component';

describe('FieldGrantAttachmentComponent', () => {
  let component: FieldGrantAttachmentComponent;
  let fixture: ComponentFixture<FieldGrantAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldGrantAttachmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldGrantAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
