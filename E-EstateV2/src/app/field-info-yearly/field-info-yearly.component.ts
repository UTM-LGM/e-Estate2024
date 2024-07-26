import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstateService } from '../_services/estate.service';
import { Estate } from '../_interface/estate';
import { Field } from '../_interface/field';
import { FieldInfoYearly } from '../_interface/fieldInfoYearly';
import { SharedService } from '../_services/shared.service';
import { FieldInfoYearlyService } from '../_services/field-info-yearly.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { TappingSystem } from '../_interface/tappingSystem';
import { TappingSystemService } from '../_services/tapping-system.service';
import { SubscriptionService } from '../_services/subscription.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { FieldService } from '../_services/field.service';

@Component({
  selector: 'app-field-info-yearly',
  templateUrl: './field-info-yearly.component.html',
  styleUrls: ['./field-info-yearly.component.css']
})
export class FieldInfoYearlyComponent implements OnInit, OnDestroy {
  yearNow = 0
  estate: Estate = {} as Estate

  fields: Field[] = []
  filterFields: Field[] = []

  fieldInfo: FieldInfoYearly[] = []

  tappingSystems: TappingSystem[] = []

  constructor(
    private route: ActivatedRoute,
    private estateService: EstateService,
    private sharedService: SharedService,
    private fieldInfoYearlyService: FieldInfoYearlyService,
    private router: Router,
    private location: Location,
    private tappingSystemService: TappingSystemService,
    private subscriptionService:SubscriptionService,
    private myLesenService: MyLesenIntegrationService,
    private fieldService: FieldService
  ) { }

  ngOnInit() {
    this.yearNow = new Date().getFullYear()
    this.getEstate()
    this.getTappingSystem()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response;
                this.getField()
              }
            )
        this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }


  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const filterFields = Response.filter(x => x.estateId == this.estate.id)
          this.filterFields = filterFields.filter(e => e.isMature === true && e.isActive === true && !e.fieldStatus?.toLowerCase().includes("conversion"))
          this.getExtraFieldInfo(this.filterFields)
        }
      )
      this.subscriptionService.add(getField);
  }

  getTappingSystem() {
    const getTappingSystem = this.tappingSystemService.getTappingSystem()
      .subscribe(
        Response => {
          const tapping = Response
          this.tappingSystems = tapping.filter(x => x.isActive == true)
        }
      )
    this.subscriptionService.add(getTappingSystem);
    
  }

  getExtraFieldInfo(fields: Field[]) {
    fields.forEach(x => {
      let fieldInfo = {} as FieldInfoYearly
      fieldInfo.fieldId = x.id
      fieldInfo.currentTreeStand = null
      fieldInfo.year = this.yearNow
      fieldInfo.tappingSystemId = 0
      fieldInfo.createdBy = this.sharedService.userId
      fieldInfo.createdDate = new Date()
      this.fieldInfo.push(fieldInfo)
    })
  }

  add() {
    swal.fire({
      title: 'Are you sure to submit ? ',
      text: 'There is no editing after submission',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.fieldInfoYearlyService.addExtraFieldInfo(this.fieldInfo)
            .subscribe(
              Response => {
                swal.fire({
                  title: 'Done!',
                  text: 'Field information yearly successfully submitted!',
                  icon: 'success',
                  showConfirmButton: true,
                  confirmButtonText: 'Done',
                })
              })
          this.router.navigateByUrl('/notification')
        }
      })
  }

  back() {
    this.location.back()
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
