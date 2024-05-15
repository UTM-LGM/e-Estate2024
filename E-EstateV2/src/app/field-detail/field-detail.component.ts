import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Field } from '../_interface/field';
import { DatePipe } from '@angular/common';
import { FieldStatus } from '../_interface/fieldStatus';
import { Clone } from '../_interface/clone';
import swal from 'sweetalert2';
import { FieldClone } from '../_interface/fieldClone';
import { Location } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import { FieldConversion } from '../_interface/fieldConversion';
import { FieldService } from '../_services/field.service';
import { FieldStatusService } from '../_services/field-status.service';
import { CloneService } from '../_services/clone.service';
import { FieldConversionService } from '../_services/field-conversion.service';
import { FieldCloneService } from '../_services/field-clone.service';
import { FieldDiseaseService } from '../_services/field-disease.service';
import { FieldDisease } from '../_interface/fieldDisease';
import { FieldInfected } from '../_interface/fieldInfected';
import { FieldInfectedService } from '../_services/field-infected.service';
import { OtherCrop } from '../_interface/otherCrop';
import { OtherCropService } from '../_services/other-crop.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-field-detail',
  templateUrl: './field-detail.component.html',
  styleUrls: ['./field-detail.component.css'],
})
export class FieldDetailComponent implements OnInit,OnDestroy {
  field: Field = {} as Field
  filteredFields: any = {}

  fields: Field[] = []

  fieldClone: FieldClone = {} as FieldClone
  fieldConversion: FieldConversion = {} as FieldConversion

  fieldInfect: FieldInfected = {} as FieldInfected

  selected: FieldStatus = {} as FieldStatus

  fieldStatus: FieldStatus[] = []
  filterFieldStatus: FieldStatus[] = []

  fieldClones: Clone[] = []
  availableClones: Clone[] = []
  clones: Clone[] = []
  filterClones: Clone[] = []
  selectedValues: Clone[] = []

  filterFieldDisease: FieldDisease[] = []

  filterFieldInfected: FieldInfected[] = []

  fieldSick = false
  dataRows: any[] = [{ year: null, currentTreeStand: null }]

  formattedDate = ''
  conversion = false
  conversionButton = false
  updateConversionBtn = false
  disableInput = false
  isLoading = true
  onInit = true
  fieldInfecteds = false
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  term = ''

  otherCrops: OtherCrop[] = []



  sortableColumn = [
    { columnName: 'dateInfected', displayText: 'Date Infected' },
    { columnName: 'fieldName', displayText: 'Field / Block' },
    { columnName: 'area', displayText: 'Field Area (Ha)' },
    { columnName: 'areaInfected', displayText: 'Area Infected (Ha)' },
    { columnName: 'fieldDiseaseName', displayText: 'Field Disease Name' },
    { columnName: 'severityLevel', displayText: 'Level Infected' },
    { columnName: 'dateRecovered', displayText: 'Date Recovered' },
    { columnName: 'remark', displayText: 'Remark' },
  ];

  constructor(
    private route: ActivatedRoute,
    private fieldService: FieldService,
    private datePipe: DatePipe,
    private fieldStatusService: FieldStatusService,
    private cloneService: CloneService,
    private fieldConversionService: FieldConversionService,
    private location: Location,
    private sharedService: SharedService,
    private fieldCloneService: FieldCloneService,
    private fieldDiseaseService: FieldDiseaseService,
    private fieldInfectedService: FieldInfectedService,
    private otherCropService: OtherCropService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.onInit = true
    this.getOneField()
    this.getClone()
    this.getFieldDisease()
    this.getField()
    this.getOtherCrop()
  }

  getOtherCrop() {
    const getOtherCrop = this.otherCropService.getOtherCrop()
      .subscribe(
        Response => {
          this.otherCrops = Response.filter(x => x.isActive == true)
        }
      )
      this.subscriptionService.add(getOtherCrop);
  }

  getOneField() {
    this.route.params.subscribe((routeParams) => {
      if (routeParams['id'] != null) {
        const getOneField = this.fieldService.getOneField(routeParams['id'])
          .subscribe(
            Response => {
              this.field = Response
              this.isLoading = false
              this.getcategory(this.field)
              this.field.cloneId = 0;
              this.fieldClones = Response.clones
              this.selectedValues = this.fieldClones
              this.availableClones = this.filterClones.filter(clone => !this.selectedValues.some(selectedClone => selectedClone.id === clone.id))
              this.getDate(Response.dateOpenTapping)
              this.getFieldInfected()
            });
      this.subscriptionService.add(getOneField);

      }
    })
  }

  getFieldInfected() {
    const getFieldInfected = this.fieldInfectedService.getFieldInfectedById(this.field.id)
      .subscribe(
        Response => {
          this.filterFieldInfected = Response
          if (this.filterFieldInfected.length > 0) {
            this.fieldInfecteds = true
          }
        }
      )
      this.subscriptionService.add(getFieldInfected);

  }

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const fields = Response
          this.fields = fields.filter(x => x.estateId == this.sharedService.estateId)
        }
      )
      this.subscriptionService.add(getField);

  }

  checkFieldStatus() {
    const conversionField = this.field.fieldStatuses.map(x => x.fieldStatus.toLowerCase().includes("conversion"))
    const convert = this.filterFieldStatus.find(x => x.fieldStatus.toLowerCase().includes("conversion"))
    if (this.field.conversionId != 0 && this.field.fieldStatusId == convert?.id && conversionField) {
      this.conversion = true
      this.updateConversionBtn = true
    }
    else {
      this.conversion = false
    }
  }

  getDate(date: string | null) {
    this.formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd') || ''
    this.field.dateOpenTapping = this.formattedDate.toString()
  }

  getcategory(field: Field) {
    const getFieldStatus = this.fieldStatusService.getFieldStatus()
      .subscribe(
        Response => {
          if (this.onInit == true) {
            this.fieldStatus = Response
            this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == field.isMature && c.isActive == true)
            this.checkFieldStatus()
            this.onInit = false
          }
          else {
            this.field.fieldStatusId = 0
            this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == this.field.isMature && c.isActive == true)
          }
        });
      this.subscriptionService.add(getFieldStatus);
  }

  updateField(field: Field) {
    field.updatedBy = this.sharedService.userId.toString()
    field.updatedDate = new Date()
    field.dateOpenTapping = field.dateOpenTappingFormatted
    const { fieldStatus, ...newFields } = this.field
    this.filteredFields = newFields
    this.fieldService.updateField(this.filteredFields)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Field successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
        });

  }

  updateConversion(field: Field) {
    this.fieldConversion.id = field.conversionId
    this.fieldConversion.sinceYear = field.sinceYear
    this.fieldConversion.updatedBy = this.sharedService.userId.toString()
    this.fieldConversion.updatedDate = new Date()
    this.fieldConversion.otherCropId = this.field.otherCropId
    this.fieldConversionService.updateConversion(this.fieldConversion)
      .subscribe(
        Response => {
          field.updatedBy = this.sharedService.userId.toString()
          field.updatedDate = new Date()
          const { fieldStatus, ...newFields } = this.field
          this.filteredFields = newFields
          this.fieldService.updateField(this.filteredFields)
            .subscribe(
              Response => {
                swal.fire({
                  title: 'Done!',
                  text: 'Conversion field successfully updated!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
              }
            )
        })
  }

  getClone() {
    const getClone = this.cloneService.getClone()
      .subscribe(
        Response => {
          this.clones = Response
          this.filterClones = this.clones.filter((e) => e.isActive == true)
        });
      this.subscriptionService.add(getClone);

  }

  status(field: Field) {
    field.updatedBy = this.sharedService.userId.toString()
    field.updatedDate = new Date()
    field.isActive = !field.isActive
    const { fieldStatus, ...newFields } = this.field
    this.filteredFields = newFields
    this.fieldService.updateField(this.filteredFields)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Field Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
        }
      );
  }

  addClone(field: Field) {
    if (this.field.cloneId == 0) {
      swal.fire({
        text: 'Please choose clone',
        icon: 'error'
      });
    } else {
      this.fieldClone.fieldId = field.id
      this.fieldClone.cloneId = field.cloneId
      this.fieldClone.isActive = true
      this.fieldClone.createdBy = this.sharedService.userId.toString()
      this.fieldClone.createdDate = new Date()
      this.fieldService.addClone(this.fieldClone)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Clone successfully added!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.ngOnInit()
          }
        )
    }
  }

  changeFieldStatus(fieldStatusId: any) {
    this.checkDisease(fieldStatusId)
    const conversionItem = this.filterFieldStatus.find(x => x.fieldStatus.toLowerCase().includes("conversion") && !x.fieldStatus.toLowerCase().includes("rubber"))
    if (fieldStatusId.value == conversionItem?.id && this.field.conversionId == 0) {
      this.conversion = true
      this.conversionButton = true
    }
    else if (fieldStatusId.value == conversionItem?.id) {
      this.conversion = true
      this.updateConversionBtn = true
    }
    else {
      this.conversion = false
      this.conversionButton = false
      this.updateConversionBtn = false
    }
  }

  checkDisease(fieldStatusId: any) {
    if (this.field.isMature == true) {
      const infected = this.fieldStatus.find(x => x.fieldStatus.toLowerCase().includes("infected") && x.isMature == true);
      if (fieldStatusId.value == infected?.id) {
        this.fieldSick = true
      }
      else {
        this.fieldSick = false
      }
    }
    else if (this.field.isMature == false) {
      const infected = this.fieldStatus.find(x => x.fieldStatus.toLowerCase().includes("infected") && x.isMature == false);
      if (fieldStatusId.value == infected?.id) {
        this.fieldSick = true
      }
      else {
        this.fieldSick = false
      }
    }
  }

  delete(cloneId: number, fieldId: number) {
    {
      swal.fire({
        title: "Are you sure to delete ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'Cancel'
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.fieldService.deleteClone(cloneId, fieldId)
              .subscribe(
                Response => {
                  swal.fire({
                    title: 'Deleted!',
                    text: 'Clone has been deleted!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                  });
                  this.ngOnInit()
                }
              )
          } else if (result.isDenied) {
          }
        });
    }
  }

  back() {
    this.location.back()
  }

  convertField(field: Field) {
    this.fieldConversion.fieldId = this.field.id
    this.fieldConversion.sinceYear = this.field.sinceYear
    this.fieldConversion.createdBy = this.sharedService.userId.toString()
    this.fieldConversion.createdDate = new Date()
    this.fieldConversion.otherCropId = this.field.otherCropId
    this.fieldConversionService.addConversion(this.fieldConversion)
      .subscribe(
        Response => {
          this.fieldCloneService.updateFieldClone(this.filteredFields)
            .subscribe(
              Response => {
                field.updatedBy = this.sharedService.userId.toString()
                field.updatedDate = new Date()
                const { fieldStatus, ...newFields } = this.field
                this.filteredFields = newFields
                this.fieldService.updateField(this.filteredFields)
                  .subscribe(
                    Response => {
                      swal.fire({
                        title: 'Done!',
                        text: 'Field successfully converted!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                      });
                      this.ngOnInit()
                    }
                  )
              }
            )
        }
      )
    this.updateConversionBtn = true
    this.conversionButton = false
    this.disableInput = true
  }

  getFieldDisease() {
    const getFieldDisease = this.fieldDiseaseService.getFieldDisease()
      .subscribe(
        Response => {
          const fieldDisease = Response
          this.filterFieldDisease = fieldDisease.filter(e => e.isActive == true)
        }
      )
      this.subscriptionService.add(getFieldDisease);
    
  }

  fieldInfected(field: Field) {
    this.fieldInfect.fieldId = this.field.id
    this.fieldInfect.areaInfected = this.field.areaInfected
    this.fieldInfect.fieldDiseaseId = this.field.fieldDiseaseId
    this.fieldConversion.createdBy = this.sharedService.userId.toString()
    this.fieldConversion.createdDate = new Date()
  }

  checkFieldName() {
    if (this.fields.some((s: any) => s.fieldName.toLowerCase() === this.field.fieldName.toLowerCase())) {
      swal.fire({
        text: 'Field/Block Name already exists!',
        icon: 'error'
      });
      this.field.fieldName = ''
    }
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}

