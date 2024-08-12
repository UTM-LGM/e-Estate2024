import { Component, OnDestroy, OnInit } from '@angular/core';
import { Field } from '../_interface/field';
import { FieldDisease } from '../_interface/fieldDisease';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { FieldService } from '../_services/field.service';
import { SharedService } from '../_services/shared.service';
import { FieldDiseaseService } from '../_services/field-disease.service';
import { FieldInfectedService } from '../_services/field-infected.service';
import swal from 'sweetalert2';
import { FieldInfected } from '../_interface/fieldInfected';
import { MatDialog } from '@angular/material/dialog';
import { FieldInfectedDetailComponent } from '../field-infected-detail/field-infected-detail.component';
import { FieldInfectedStatusComponent } from '../field-infected-status/field-infected-status.component';
import { SubscriptionService } from '../_services/subscription.service';
import { DiseaseCategoryService } from '../_services/disease-category.service';
import { DiseaseCategory } from '../_interface/diseaseCategory';

@Component({
  selector: 'app-field-infected',
  templateUrl: './field-infected.component.html',
  styleUrls: ['./field-infected.component.css']
})
export class FieldInfectedComponent implements OnInit, OnDestroy {
  estate: any = {} as any
  selectedField = ''
  term = ''
  isLoading = true
  fieldInfected: any = {} as any
  field: any = {} as any
  fieldInfecteds: any[] = []
  allField: Field[] = []

  existing = false
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  areaAffected = 0
  isSubmit = false

  itemsPerPage = 10

  filteredFields: Field[] = []
  filterFieldDisease: FieldDisease[] = []

  diseaseCategory: DiseaseCategory[] = []
  diseaseName: FieldDisease[] = []


  sortableColumn = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'dateInfected', displayText: 'Date Infected' },
    { columnName: 'fieldName', displayText: 'Field / Block' },
    { columnName: 'area', displayText: 'Rubber Area (Ha)' },
    { columnName: 'areaInfectedPercentage', displayText: 'Area Infected Percentage (%)' },
    { columnName: 'areaInfected', displayText: 'Area Infected (Ha)' },
    { columnName: 'diseaseCategory', displayText: 'Disease Category' },
    { columnName: 'fieldDiseaseName', displayText: 'Disease Name' },
    { columnName: 'severityLevel', displayText: 'Level Infected' },
    { columnName: 'dateRecovered', displayText: 'Date Recovered' },
    { columnName: 'remark', displayText: 'Remark' },
  ];

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private fieldService: FieldService,
    private sharedService: SharedService,
    private fieldDiseaseService: FieldDiseaseService,
    private fieldInfectedService: FieldInfectedService,
    private dialog: MatDialog,
    private subscriptionService: SubscriptionService,
    private diseaseCategoryService: DiseaseCategoryService
  ) { }


  ngOnInit(): void {
    this.getEstate()
    this.getField()
    this.getFieldDisease()
    this.fieldInfected.fieldId = 0
    this.getDiseaseCategory()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.getFieldInfected(routerParams['id'])
                this.isLoading = false
              })
          this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }

  getFieldInfected(estateId: number) {
    const getFieldInfected = this.fieldInfectedService.getFieldInfectedByEstateId(estateId)
      .subscribe(
        Response => {
          this.fieldInfecteds = Response
        }
      )
    this.subscriptionService.add(getFieldInfected);

  }

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          this.allField = Response
          this.filteredFields = this.allField.filter(x => x.estateId == this.sharedService.estateId && x.isActive == true && !x.fieldStatus?.toLowerCase().includes("conversion to other crop"))
        }
      )
    this.subscriptionService.add(getField);

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

  getDiseaseCategory() {
    this.diseaseCategoryService.getDiseaseCategory()
      .subscribe(
        Response => {
          this.diseaseCategory = Response
        }
      )
  }

  getDiseaseName() {
    this.fieldDiseaseService.getFieldDisease()
      .subscribe(
        Response => {
          this.diseaseName = Response.filter(y => y.diseaseCategoryId == this.fieldInfected.diseaseCategoryId && y.isActive == true)
        }
      )
  }

  toggleField(event: any) {
    this.selectedField = event.target.value
    if (this.selectedField == "existing") {
      this.existing = true
    }
    else {
      this.existing = false
    }
  }

  submit() {
    if (this.fieldInfected.fieldId == '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else {
      this.fieldInfected.isActive = true;
      this.fieldInfected.createdBy = this.sharedService.userId;
      this.isSubmit = true;
      this.fieldInfectedService.addFieldInfected(this.fieldInfected)
        .subscribe({
          next: (response) => {
            swal.fire({
              title: 'Done!',
              text: 'Field Infected successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.fieldInfected = {};
            this.ngOnInit();  // Reinitialize the component state if needed
          },
          error: (error) => {
            swal.fire({
              title: 'Error!',
              text: 'Failed to submit Field Infected!',
              icon: 'error',
              showConfirmButton: true
            });
          }
        });
      this.isSubmit = false;
    }
  }

  selectedFieldName(fieldId: any) {
    const fieldIdSelected = this.filteredFields.find(x => x.id == fieldId.value)
    this.fieldInfected.area = fieldIdSelected?.rubberArea
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  checkFieldName() {
    const field = this.allField.filter(x => x.estateId == this.sharedService.estateId)
    if (field.some((s: any) => s.fieldName.toLowerCase() === this.fieldInfected.fieldName.toLowerCase())) {
      swal.fire({
        text: 'Field/Block Name already exists!',
        icon: 'error'
      });
      this.field.fieldName = ''
    }
  }

  openDialog(field: FieldInfected) {
    const dialogRef = this.dialog.open(FieldInfectedDetailComponent, {
      data: { data: field },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

  openDialogStatus(field: FieldInfected) {
    const dialogRef = this.dialog.open(FieldInfectedStatusComponent, {
      data: { data: field },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit
        }
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  validateArea() {
    if (this.fieldInfected.areaInfected > this.fieldInfected.area) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert infected area less than field area',
      });
      this.fieldInfected.areaInfected = null
    }
  }


  calculateArea() {
    const areaInfected = this.fieldInfected.area * (this.fieldInfected.areaInfectedPercentage / 100)
    return this.fieldInfected.areaInfected = areaInfected.toFixed(2)
  }

  validatePercentage() {
    switch (this.fieldInfected.severityLevel) {
      case 'HIGH':
        this.validateHigh();
        break;
      case 'MEDIUM':
        this.validateMedium();
        break;
      case 'LOW':
        this.validateLow();
        break;
      default:
        break;
    }
  }

  levelChange(){
    this.fieldInfected.areaInfectedPercentage = null
    this.fieldInfected.areaInfected = null
  }

  validateHigh() {
    const percentage = this.fieldInfected.areaInfectedPercentage;
    if (percentage < 50) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Percentage should be greater than 50% for HIGH severity level.'
      });
      this.fieldInfected.areaInfectedPercentage = null
    }
  }

  validateMedium() {
    const percentage = this.fieldInfected.areaInfectedPercentage;
    if (percentage < 16 || percentage > 49) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Percentage should be between 16% - 49% for MEDIUM severity level.'
      });
      this.fieldInfected.areaInfectedPercentage = null
    }

  }

  validateLow() {
    const percentage = this.fieldInfected.areaInfectedPercentage;
    if (percentage < 1 || percentage > 15) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Percentage should be between 1% - 15% for LOW severity level.'
      });
      this.fieldInfected.areaInfectedPercentage = null

    }
  }

  calculateIndex(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }

  onPageChange(newPageNumber: number) {
    if (newPageNumber < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = newPageNumber;
    }
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

}
