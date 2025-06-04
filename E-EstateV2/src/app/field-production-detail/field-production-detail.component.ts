import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FieldProduction } from '../_interface/fieldProduction';
import swal from 'sweetalert2';
import { FieldProductionComponent } from '../field-production/field-production.component';
import { SharedService } from '../_services/shared.service';
import { FieldProductionService } from '../_services/field-production.service';
import { SpinnerService } from '../_services/spinner.service';

@Component({
  selector: 'app-field-production-detail',
  templateUrl: './field-production-detail.component.html',
  styleUrls: ['./field-production-detail.component.css'],
})
export class FieldProductionDetailComponent implements OnInit {
  product: FieldProduction = {} as FieldProduction

  constructor(
    public dialogRef: MatDialogRef<FieldProductionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: FieldProduction },
    private fieldProductionService: FieldProductionService,
    private sharedService: SharedService,
    private spinnerService:SpinnerService
  ) { }

  ngOnInit() {
    this.product = this.data.data
  }

  update() {
    this.spinnerService.requestStarted()
    this.product.updatedBy = this.sharedService.userId.toString()
    this.product.updatedDate = new Date()
    this.fieldProductionService.updateProduction(this.product)
      .subscribe(
        {
          next: (Response) => {
            this.spinnerService.requestEnded()
            swal.fire({
              title: 'Done!',
              text: 'Production successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialogRef.close()
          },
          error: (err) => {
            this.spinnerService.requestEnded()
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please insert all value',
            });
          }
        });
  }

  back() {
    this.dialogRef.close()
  }

  validateCuplumpDRC(drc: any) {
    const drcValue = drc.target.value
    if ((drcValue >= 45 && drcValue <= 100) || drc === 0) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'CuplumpDRC must be between 45% to 100%',
        icon: 'error',
        showConfirmButton: true
      });
      this.product.cuplumpDRC = 0
    }
  }

  validateLatexDRC(drc: any) {
    const drcValue = drc.target.value
    if ((drcValue >= 20 && drcValue <= 55) || drc === 0) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'LatexDRC must be between 20% to 55%',
        icon: 'error',
        showConfirmButton: true
      });
      this.product.latexDRC = 0
    }
  }

  taskTap(taskTap: any, totalTask: number) {
    if (taskTap > totalTask) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of Task Tap is more than total task ! Total Task :' + totalTask,
      });
      this.product.noTaskTap = 0
    }
    else {
      this.product.noTaskUntap = totalTask - taskTap
    }
  }

  initialZeroCuplump(index: any) {
    if (index == 0) {
      this.product.cuplumpDRC = 0
    }
  }

  initialZeroLatex(index: any) {
    if (index == 0) {
      this.product.latexDRC = 0
    }
  }

  initialZeroUSS(index: any) {
    if (index == 0) {
      this.product.ussDRC = 0
    }
  }

  initialZeroOthers(index: any) {
    if (index == 0) {
      this.product.othersDRC = 0
    }
  }

}
