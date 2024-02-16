import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-field-detail',
  templateUrl: './field-detail.component.html',
  styleUrls: ['./field-detail.component.css'],
})
export class FieldDetailComponent implements OnInit {
  fields: Field = {} as Field
  filteredFields: any = {}

  fieldClone: FieldClone = {} as FieldClone
  fieldConversion: FieldConversion = {} as FieldConversion

  selected: FieldStatus = {} as FieldStatus

  fieldStatus: FieldStatus[] = []
  filterFieldStatus: FieldStatus[] = []

  fieldClones: Clone[] = []
  availableClones: Clone[] = []
  clones: Clone[] = []
  filterClones: Clone[] = []
  selectedValues: Clone[] = []

  filterFieldDisease : FieldDisease [] =[]

  infected = false
  dataRows: any[] = [{ year: null, currentTreeStand: null }]

  formattedDate = ''
  conversion = false
  conversionButton = false
  updateConversionBtn = false
  disableInput = false
  isLoading = true
  onInit = true

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
    private fieldDiseaseService: FieldDiseaseService

  ) { }

  ngOnInit() {
    this.onInit = true
    this.getOneField()
    this.getClone()
    this.getFieldDisease()
  }


  getOneField() {
    this.route.params.subscribe((routeParams) => {
      if (routeParams['id'] != null) {
        this.infected = false
        this.fieldService.getOneField(routeParams['id'])
          .subscribe(
            Response => {
              this.fields = Response
              if(Response.fieldDiseaseId != null)
              {
                this.infected=true
                this.disableInput = true
              }else if(Response.fieldDiseaseId == null){
                this.infected = false
              }
              this.isLoading = false
              this.getcategory(this.fields)
              const conversion = this.fields.fieldStatuses.map(x => x.fieldStatus.toLowerCase().includes("conversion"))
              if (this.fields.conversionId != 0 && conversion) {
                this.disableInput = true
                this.conversion = true
                this.updateConversionBtn = true
              }
              else {
                this.conversion = false
              }
              this.fields.cloneId = 0;
              this.fieldClones = Response.clones
              this.selectedValues = this.fieldClones
              this.availableClones = this.filterClones.filter(clone => !this.selectedValues.some(selectedClone => selectedClone.id === clone.id))
              this.getDate(Response.dateOpenTapping)
            });
      }
    })
  }

  getDate(date: string | null) {
    this.formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd') || ''
    this.fields.dateOpenTapping = this.formattedDate.toString()
  }

  getcategory(field: Field) {
    if(this.fields.fieldDiseaseId == null){
      this.infected = false
    }
    this.fieldStatusService.getFieldStatus()
      .subscribe(
        Response => {
          if (this.onInit == true) {
            this.fieldStatus = Response
            this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == field.isMature && c.isActive == true)
            this.onInit = false
          }
          else {
            this.fields.fieldStatusId = 0
            this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == this.fields.isMature && c.isActive == true)
          }
        });
  }

  updateField(field: Field) {
    field.updatedBy = this.sharedService.userId.toString()
    field.updatedDate = new Date()
    const { fieldStatus, ...newFields } = this.fields
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
          setTimeout(() => {
            location.reload()
          }, 2000);
        });

  }

  updateConversion(field: Field) {
    this.fieldConversion.id = field.conversionId
    this.fieldConversion.conversionCropName = field.conversionCropName
    this.fieldConversion.sinceYear = field.sinceYear
    this.fieldConversion.updatedBy = this.sharedService.userId.toString()
    this.fieldConversion.updatedDate = new Date()
    this.fieldConversionService.updateConversion(this.fieldConversion)
      .subscribe(
        Response => {
          field.updatedBy = this.sharedService.userId.toString()
          field.updatedDate = new Date()
          const { fieldStatus, ...newFields } = this.fields
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
    this.cloneService.getClone()
      .subscribe(
        Response => {
          this.clones = Response
          this.filterClones = this.clones.filter((e) => e.isActive == true)
        });
  }

  status(field: Field) {
    field.updatedBy = this.sharedService.userId.toString()
    field.updatedDate = new Date()
    field.isActive = !field.isActive
    const { fieldStatus, ...newFields } = this.fields
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
    if(this.fields.cloneId == 0){
      swal.fire({
        text: 'Please choose clone',
        icon: 'error'
      });
    }else {
    this.fieldClone.fieldId = field.id
    this.fieldClone.cloneId = field.cloneId
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
    const conversionItem = this.fieldStatus.find(x => x.fieldStatus.toLowerCase().includes("conversion"))
    if (fieldStatusId.value == conversionItem?.id && this.fields.conversionId == 0) {
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

  checkDisease(fieldStatusId:any){
    if(this.fields.isMature == true){
      const infected = this.fieldStatus.find(x => x.fieldStatus.toLowerCase().includes("infected") && x.isMature == true);
      if(fieldStatusId.value == infected?.id){
        this.infected= true
      }
      else{
        this.infected = false
      }
    }
    else if(this.fields.isMature == false){
      const infected = this.fieldStatus.find(x => x.fieldStatus.toLowerCase().includes("infected") && x.isMature == false);
      if(fieldStatusId.value == infected?.id){
        this.infected= true
      }
      else{
        this.infected = false
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
    this.fieldConversion.fieldId = this.fields.id
    this.fieldConversion.conversionCropName = this.fields.conversionCropName
    this.fieldConversion.sinceYear = this.fields.sinceYear
    this.fieldConversion.createdBy = this.sharedService.userId.toString()
    this.fieldConversion.createdDate = new Date()
    this.fieldConversionService.addConversion(this.fieldConversion)
      .subscribe(
        Response => {
          this.fieldCloneService.updateFieldClone(this.filteredFields)
            .subscribe(
              Response => {
                field.updatedBy = this.sharedService.userId.toString()
                field.updatedDate = new Date()
                const { fieldStatus, ...newFields } = this.fields
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

  getFieldDisease(){
    this.fieldDiseaseService.getFieldDisease()
    .subscribe(
      Response =>{
        const fieldDisease = Response
        this.filterFieldDisease = fieldDisease.filter (e=>e.isActive == true)
      }
    )
  }

}

