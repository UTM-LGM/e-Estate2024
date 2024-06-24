import { Component, OnDestroy, OnInit } from '@angular/core';
import { Field } from '../_interface/field';
import swal from 'sweetalert2';
import { FieldStatus } from '../_interface/fieldStatus';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';
import { FieldService } from '../_services/field.service';
import { SharedService } from '../_services/shared.service';
import { FieldCloneService } from '../_services/field-clone.service';
import { Clone } from '../_interface/clone';
import { CloneService } from '../_services/clone.service';
import { FieldStatusService } from '../_services/field-status.service';
import { Location } from '@angular/common';
import { FieldGrant } from '../_interface/fieldGrant';
import { FieldGrantService } from '../_services/field-grant.service';


@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.css']
})
export class AddFieldComponent implements OnInit, OnDestroy {

  fields: Field[] = []
  field: Field = {} as Field

  fieldGrant:FieldGrant = {} as FieldGrant

  cropCategories: FieldStatus[] = []
  filterCropCategories: FieldStatus[] = []

  selectedValues: any[] = []

  estate: any = {} as any

  clones: Clone[] = []
  filterClones: Clone[] = []
  availableClones: Clone[] = []
  addedGrant:any[]=[]


  rubberArea = ''
  conversion = false
  isSubmit = false
  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService,
    private fieldService: FieldService,
    private sharedService: SharedService,
    private fieldCloneService: FieldCloneService,
    private cloneService: CloneService,
    private fieldStatusService: FieldStatusService,
    private location: Location,
    private fieldGrantService:FieldGrantService
  ){}


  ngOnInit(){
    this.getEstate()
    this.getClone()
    this.getCrop()


  }

  getClone() {
    const getClone = this.cloneService.getClone()
      .subscribe(Response => {
        this.clones = Response
        this.filterClones = this.clones.filter((e) => e.isActive == true)
        this.availableClones = this.filterClones
      });
      this.subscriptionService.add(getClone);

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

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.getField()
                this.isLoading = false
              })
        this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }

  getCrop() {
    const getCrop = this.fieldStatusService.getFieldStatus()
      .subscribe(
        Response => {
          this.cropCategories = Response
        });
      this.subscriptionService.add(getCrop);
  }

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const fields = Response
          this.fields = fields.filter(x => x.estateId == this.estate.id)
        }
      )
      this.subscriptionService.add(getField);
      
  }

  getcategory() {
    this.filterCropCategories = this.cropCategories.filter(c => c.isMature == this.field.isMature
      && c.isActive == true
      && !(c.fieldStatus.toLowerCase().includes("conversion") && c.isMature == true))
  }

  rubberAreaInput(){
    if(this.rubberArea == "yes"){
      this.field.rubberArea = this.field.area
    }
  }

  onRadioChange() {
    if (this.rubberArea === 'yes') {
      this.field.rubberArea = this.field.area;
    }
    else{
      this.field.rubberArea = null
    }
  }

  areaRemark(){
    if(this.field.rubberArea != null && this.field.rubberArea > this.field.area ){
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rubber area cannot be more than field area',
      });
      this.field.rubberArea = null
    }
  }

  yearSelected() {
    const yearAsString = this.field.yearPlanted.toString()
    if (yearAsString.length !== 4) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.field.yearPlanted = ''
    }

  }

  checkDOT(){
    if (this.field.yearPlanted && this.field.dateOpenTapping) {
      const yearPlanted = this.field.yearPlanted;
      const dateOpenTappingYear = new Date(this.field.dateOpenTapping).getFullYear();

      if (dateOpenTappingYear < parseInt(yearPlanted) + 5) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Date Open Tapping cannot be 5 year less than Year Planted',
        });
        this.field.dateOpenTapping = null; // Resetting the dateOpenTapping field
      }
    }
  }

  onSubmit() {
    if (this.field.fieldName == '') {
      swal.fire({
        text: 'Please fil up the form',
        icon: 'error'
      });
      this.isSubmit = false
    }
    else {
      if(this.selectedValues.length == 0 && this.field.isMature == true){
        swal.fire({
          text: 'Please insert clone planted',
          icon: 'error'
        });
      }
      else{
        this.field.estateId = this.estate.id
        this.field.isActive = true
        this.field.createdBy = this.sharedService.userId.toString()
        this.field.createdDate = new Date()
        if(this.field.dateOpenTapping){
          this.field.dateOpenTapping = this.convertToDateTime(this.field.dateOpenTapping);
        }
        else{
          this.field.dateOpenTapping = null
        }
        this.isSubmit = true
        this.fieldService.addField(this.field)
          .subscribe(
            {
              next: (Response) => {
                const combineClone: any[] = this.selectedValues.map(item => {
                  return { 'cloneId': item.id, 'isActive': true, 'fieldId': Response.id, 'createdBy': Response.createdBy, 'createdDate': Response.createdDate }
                })
                const combineGrant : any [] = this.addedGrant.map((item:any) =>{
                  return {'grantTitle':item.grantTitle.toUpperCase(), 'grantArea':item.grantArea, 'grantRubberArea':item.grantRubberArea, 'isActive': true, 'fieldId': Response.id, 'createdBy': Response.createdBy, 'createdDate': Response.createdDate }
                })
                this.fieldCloneService.addFieldClone(combineClone)
                  .subscribe(
                    Response => {
                      this.fieldGrantService.addFieldGrantArray(combineGrant).subscribe(
                        Response =>{
                          swal.fire({
                            title: 'Done!',
                            text: 'Field successfully submitted!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1000
                          });
                        }
                      )
                      this.selectedValues = []
                      this.addedGrant = []
                      this.field = {} as Field
                      this.ngOnInit()
                      this.rubberArea = ''
                      this.isSubmit = false
                    })
              }, error: (err) => {
                swal.fire({
                  text: 'Please fil up the form',
                  icon: 'error'
                });
                this.isSubmit = false
              }
            });
        }
      
    }
  }

  convertToDateTime(monthYear: string): string {
    // monthYear is in the format YYYY-MM
    const [year, month] = monthYear.split('-').map(Number);
    // Set the date to the first day of the selected month, time to midnight
    const date = new Date(year, month - 1, 1, 0, 0, 0);
    return date.toISOString(); // Convert to ISO string or any other desired format
  }

  selectedClone(value: Field) {
    if (this.field.cloneId == 0) {
      swal.fire({
        text: 'Please choose clone',
        icon: 'error'
      })
    }
    else {
      const item = this.filterClones.find((x) => x.id == value.cloneId)
      this.selectedValues.push(item)
      this.field.cloneId = 0
      this.availableClones = this.filterClones.filter(x => !this.selectedValues.includes(x))
    }
  }

  delete(index: number) {
    this.selectedValues.splice(index, 1)
    this.availableClones = this.filterClones.filter(x => !this.selectedValues.includes(x))
  }

  back() {
    this.location.back()
  }

  selectedGrant(fieldGrant:FieldGrant){
    if(this.fieldGrant.grantTitle == ''){
      swal.fire({
        text: 'Please fill up grant title',
        icon: 'error'
      })
    }
    else{
      let grantInfo = {} as any
      grantInfo.grantTitle = fieldGrant.grantTitle
      grantInfo.grantArea = fieldGrant.grantArea
      grantInfo.grantRubberArea = fieldGrant.grantRubberArea
      this.addedGrant.push(grantInfo)
      this.fieldGrant.grantTitle = ''
      this.fieldGrant.grantArea = null
      this.fieldGrant.grantRubberArea = null
    }
  }

  deleteGrant(index: number) {
    this.addedGrant.splice(index, 1)
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }



}
