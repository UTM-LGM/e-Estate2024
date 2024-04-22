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

  field:Field = {} as Field

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
    @Inject (MAT_DIALOG_DATA) public data: {data:FieldInfected},
    private fieldService:FieldService,
    private fieldStatusService: FieldStatusService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private cloneService:CloneService,
    private fieldCloneService: FieldCloneService,
    private fieldInfectedService:FieldInfectedService,
    private location: Location,
    public dialogRef: MatDialogRef<FieldInfectedComponent>,

  ){}

  ngOnInit(): void {
    // this.onInit = true
    // this.getField()
    this.fieldInfected = this.data.data
  }

  // getField(){
  //   this.route.params.subscribe((routerParams) => {
  //     if (routerParams['id'] != null) {
  //     this.fieldInfectedService.getFieldInfectedById(routerParams['id'])
  //     .subscribe(
  //       Response =>{
  //         this.fieldInfected = Response
  //         this.getFieldDetail(this.fieldInfected.fieldId)
  //       }
  //     )
  //     }
  //   })
  // }

  // getFieldDetail(fieldId:number){
  //   this.fieldService.getOneField(fieldId)
  //     .subscribe(
  //       Response =>{
  //         this.field = Response
  //         this.fieldClones = Response.clones
  //         this.getClone()
  //         this.getCrop()
  //       }
  //     )
  // }

  // getcategory(field: Field) {
  //   this.fieldStatusService.getFieldStatus()
  //     .subscribe(
  //       Response => {
  //         if (this.onInit == true) {
  //           this.fieldStatus = Response
  //           this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == field.isMature && c.isActive == true && !c.fieldStatus.toLowerCase().includes("conversion"))
  //           this.checkFieldStatus()
  //           this.onInit = false
  //         }
  //         else {
  //           this.field.fieldStatusId = 0
  //           this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == this.field.isMature && c.isActive == true&& !c.fieldStatus.toLowerCase().includes("conversion"))
  //         }
  //       });
  // }

  // checkFieldStatus(){
  //   const conversionField = this.field.fieldStatuses.map(x => x.fieldStatus.toLowerCase().includes("conversion"))
  //   const convert = this.filterFieldStatus.find(x=>x.fieldStatus.toLowerCase().includes("conversion"))
  //   if (this.field.conversionId != 0 && this.field.fieldStatusId == convert?.id && conversionField) {
  //     this.conversion = true
  //   }
  //   else {
  //     this.conversion = false
  //   }
  // }

  // getCrop() {
  //   this.fieldStatusService.getFieldStatus()
  //   .subscribe(
  //     Response => {
  //       this.fieldStatus = Response
  //       this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == this.field.isMature && c.isActive == true && !c.fieldStatus.toLowerCase().includes("conversion"))
  //     });
  // }

  // addClone(field: Field) {
  //   if(this.field.cloneId == 0){
  //     swal.fire({
  //       text: 'Please choose clone',
  //       icon: 'error'
  //     });
  //   }else {
  //   this.fieldClone.fieldId = field.id
  //   this.fieldClone.cloneId = field.cloneId
  //   this.fieldClone.createdBy = this.sharedService.userId.toString()
  //   this.fieldClone.createdDate = new Date()
  //   this.fieldService.addClone(this.fieldClone)
  //     .subscribe(
  //       Response => {
  //         swal.fire({
  //           title: 'Done!',
  //           text: 'Clone successfully added!',
  //           icon: 'success',
  //           showConfirmButton: false,
  //           timer: 1000
  //         });
  //         this.ngOnInit()
  //       }
  //     )
  //   }
  // }

  // delete(cloneId: number, fieldId: number) {
  //   {
  //     swal.fire({
  //       title: "Are you sure to delete ?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes',
  //       denyButtonText: 'Cancel'
  //     })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           this.fieldService.deleteClone(cloneId, fieldId)
  //             .subscribe(
  //               Response => {
  //                 swal.fire({
  //                   title: 'Deleted!',
  //                   text: 'Clone has been deleted!',
  //                   icon: 'success',
  //                   showConfirmButton: false,
  //                   timer: 1000
  //                 });
  //                 this.ngOnInit()
  //               }
  //             )
  //         } else if (result.isDenied) {
  //         }
  //       });
  //   }
  // }

  // getClone() {
  //   this.cloneService.getClone()
  //     .subscribe(
  //       Response => {
  //         const clones = Response
  //         this.filterClones = clones.filter((e) => e.isActive == true)
  //         this.selectedValues = this.fieldClones
  //         this.availableClones = this.filterClones.filter(clone => !this.selectedValues.some(selectedClone => selectedClone.id === clone.id))
  //       });
  // }

  // changeFieldStatus(fieldStatusId: any) {
  //   const conversionItem = this.fieldStatus.find(x => x.fieldStatus.toLowerCase().includes("conversion") && !x.fieldStatus.toLowerCase().includes("rubber"))
  //   if (fieldStatusId.value == conversionItem?.id && this.field.conversionId == 0) {
  //     this.conversion = true
  //   }
  //   else if (fieldStatusId.value == conversionItem?.id) {
  //     this.conversion = true
  //   }
  //   else {
  //     this.conversion = false
  //   }
  // }

  update(){
    if(this.fieldInfected.remark == null){
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    }
    else{
      this.fieldInfected.isActive = false
      this.fieldInfected.updatedBy = this.sharedService.userId
      this.fieldInfectedService.updateFieldInfectedRemark(this.fieldInfected)
      .subscribe(
        Response=>{
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
