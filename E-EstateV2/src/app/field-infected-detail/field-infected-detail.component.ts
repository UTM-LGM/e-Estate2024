import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FieldInfected } from '../_interface/fieldInfected';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldDiseaseService } from '../_services/field-disease.service';
import { FieldDisease } from '../_interface/fieldDisease';
import { DatePipe } from '@angular/common';
import { FieldInfectedComponent } from '../field-infected/field-infected.component';
import { FieldInfectedService } from '../_services/field-infected.service';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { SubscriptionService } from '../_services/subscription.service';


@Component({
  selector: 'app-field-infected-detail',
  templateUrl: './field-infected-detail.component.html',
  styleUrls: ['./field-infected-detail.component.css']
})
export class FieldInfectedDetailComponent implements OnInit,OnDestroy {

  fieldInfected: FieldInfected = {} as FieldInfected
  filterFieldDisease: FieldDisease[] = []
  formattedDate = ''
  dateRecovered = ''



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: FieldInfected },
    private fieldDiseaseService: FieldDiseaseService,
    private datePipe: DatePipe,
    private fieldInfectedService: FieldInfectedService,
    public dialogRef: MatDialogRef<FieldInfectedComponent>,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.fieldInfected = this.data.data
    this.formattedDate = this.datePipe.transform(this.fieldInfected.dateScreening, 'yyyy-MM-dd') || ''
    this.dateRecovered = this.datePipe.transform(this.fieldInfected.dateRecovered, 'yyyy-MM-dd') || ''
    if (this.formattedDate) {
      setTimeout(() => {
        this.fieldInfected.dateScreening = new Date(this.formattedDate)
      }, 0);
    }
    this.getFieldDisease()
  }

  getFieldDisease() {
    const getFieldDisease = this.fieldDiseaseService.getFieldDisease()
      .subscribe(
        Response => {
          const disease = Response
          this.filterFieldDisease = disease.filter(x => x.isActive == true)
        }
      )
      this.subscriptionService.add(getFieldDisease);
  }

  back() {
    this.dialogRef.close()
  }

  selectedDate(date: string) {
    if (date) {
      this.fieldInfected.dateScreening = new Date(date)
    }
  }

  selectedDateRecovered(date: string) {
    if (date) {
      this.fieldInfected.dateRecovered = new Date(date)
    }
  }

  update() {
    this.fieldInfected.updatedBy = this.sharedService.userId
    this.fieldInfected.updatedDate = new Date()
    this.fieldInfectedService.updateFieldInfected(this.fieldInfected)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Field Infected successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
