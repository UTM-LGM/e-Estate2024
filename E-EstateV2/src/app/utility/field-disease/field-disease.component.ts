import { Component, OnDestroy, OnInit } from '@angular/core';
import { DiseaseCategory } from 'src/app/_interface/diseaseCategory';
import { FieldDisease } from 'src/app/_interface/fieldDisease';
import { DiseaseCategoryService } from 'src/app/_services/disease-category.service';
import { FieldDiseaseService } from 'src/app/_services/field-disease.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-field-disease',
  templateUrl: './field-disease.component.html',
  styleUrls: ['./field-disease.component.css']
})
export class FieldDiseaseComponent implements OnInit, OnDestroy {

  fieldDisease: FieldDisease = {} as FieldDisease
  fieldDiseases: FieldDisease[] = []

  diseaseCategory : DiseaseCategory []=[]

  term = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  isLoading = true

  itemsPerPage = 10

  sortableColumns = [
    { columnName: 'diseaseCategory', displayText: 'Category'},
    { columnName: 'diseaseName', displayText: 'Disease Name' },
  ];


  constructor(
    private sharedService: SharedService,
    private fieldDiseaseService: FieldDiseaseService,
    private subscriptionService:SubscriptionService,
    private diseaseCategoryService:DiseaseCategoryService
  ) { }

  ngOnInit(): void {
    this.fieldDisease.diseaseName = ''
    this.getFieldDisease()
    this.getDiseaseCategory()
  }

  getFieldDisease() {
    setTimeout(() => {
      const getFieldDisease = this.fieldDiseaseService.getFieldDisease()
        .subscribe(
          Response => {
            this.fieldDiseases = Response
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getFieldDisease);
    })
  }

  getDiseaseCategory(){
    this.diseaseCategoryService.getDiseaseCategory()
    .subscribe(
      Response =>{
        this.diseaseCategory = Response
      }
    )
  }

  submit() {
    if (this.fieldDisease.diseaseName === '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.fieldDiseases.some(s => s.diseaseName.toLowerCase() === this.fieldDisease.diseaseName.toLowerCase())) {
      swal.fire({
        text: 'Disease Name already exists!',
        icon: 'error'
      });
    } else {
      this.fieldDisease.isActive = true
      this.fieldDisease.createdBy = this.sharedService.userId.toString()
      this.fieldDisease.createdDate = new Date()
      this.fieldDiseaseService.addFieldDisease(this.fieldDisease)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Field Disease successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          }
        )
    }
  }

  reset() {
    this.fieldDisease = {} as FieldDisease
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  status(fieldDisease: FieldDisease) {
    fieldDisease.updatedBy = this.sharedService.userId.toString()
    fieldDisease.updatedDate = new Date()
    fieldDisease.isActive = !fieldDisease.isActive
    this.fieldDiseaseService.updateFieldDisease(fieldDisease)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Field Disease successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
