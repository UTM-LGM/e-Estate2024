import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldInfected } from '../_interface/fieldInfected';
import { FieldService } from '../_services/field.service';
import { Field } from '../_interface/field';
import { FieldStatus } from '../_interface/fieldStatus';
import { FieldStatusService } from '../_services/field-status.service';
import { Clone } from '../_interface/clone';
import swal from 'sweetalert2';
import { FieldClone } from '../_interface/fieldClone';
import { SharedService } from '../_services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CloneService } from '../_services/clone.service';
import { FieldCloneService } from '../_services/field-clone.service';
import { FieldInfectedService } from '../_services/field-infected.service';
import { Location } from '@angular/common';
import { FieldInfectedComponent } from '../field-infected/field-infected.component';

@Component({
  selector: 'app-field-infected-status',
  templateUrl: './field-infected-status.component.html',
  styleUrls: ['./field-infected-status.component.css']
})
export class FieldInfectedStatusComponent implements OnInit {

  fieldInfected: FieldInfected = {} as FieldInfected

  field: Field = {} as Field

  filterFieldStatus: FieldStatus[] = []
  cropCategories: FieldStatus[] = []

  filterClones: Clone[] = []

  conversion = false
  onInit = true


  fieldClone: FieldClone = {} as FieldClone
  fieldClones: Clone[] = []

  availableClones: Clone[] = []

  disableInput = false

  selectedValues: Clone[] = []
  fieldStatus: FieldStatus[] = []


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: FieldInfected },
    private sharedService: SharedService,
    private fieldInfectedService: FieldInfectedService,
    public dialogRef: MatDialogRef<FieldInfectedComponent>,

  ) { }

  ngOnInit(): void {
    this.fieldInfected = this.data.data
  }

  update() {
    if (this.fieldInfected.remark == "") {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    }
    else {
      this.fieldInfected.isActive = false
      this.fieldInfected.updatedBy = this.sharedService.userId
      this.fieldInfectedService.updateFieldInfectedRemark(this.fieldInfected)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Field Infected updated!',
              icon: 'success',
              showConfirmButton: true
            });
            this.dialogRef.close()
          }
        )
    }
  }

  back() {
    this.dialogRef.close()
  }
}
