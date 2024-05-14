import { Component, OnDestroy, OnInit } from '@angular/core';
import { Field } from '../_interface/field';
import { FieldStatus } from '../_interface/fieldStatus';
import { Clone } from '../_interface/clone';
import { FieldClone } from '../_interface/fieldClone';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { FieldConversion } from '../_interface/fieldConversion';
import { FieldStatusService } from '../_services/field-status.service';
import { CloneService } from '../_services/clone.service';
import { FieldService } from '../_services/field.service';
import { FieldCloneService } from '../_services/field-clone.service';
import { FieldConversionService } from '../_services/field-conversion.service';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';
import { Location } from '@angular/common';
import { FieldDiseaseService } from '../_services/field-disease.service';
import { FieldDisease } from '../_interface/fieldDisease';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { FieldInfectedService } from '../_services/field-infected.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-field-info',
  templateUrl: './field-info.component.html',
  styleUrls: ['./field-info.component.css'],
})
export class FieldInfoComponent implements OnInit,OnDestroy {
  field: Field = {} as Field

  estate: any = {} as any

  selectClone: FieldClone = {} as FieldClone

  value: Field[] = []
  fields: Field[] = []

  clones: Clone[] = []
  filterClones: Clone[] = []
  filterArray: Clone[] = []
  availableClones: Clone[] = []

  combineClone: FieldClone[] = []

  selectedValues: any[] = []

  cropCategories: FieldStatus[] = []
  filterCropCategories: FieldStatus[] = []

  conversionField: FieldConversion[] = []

  filterFieldDisease: FieldDisease[] = []
  result: any = {} as any


  term = ''
  total = 0
  isLoading = true
  conversion = false
  pageNumber = 1
  order = ''
  selectedField: any
  currentSortedColumn = ''
  role = ''
  fieldSick = false

  sortableColumns = [
    { columnName: 'fieldName', displayText: 'Field / Block' },
    { columnName: 'area', displayText: 'Field Area (Ha)' },
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'fieldStatus', displayText: 'Field Status' },
    { columnName: 'yearPlanted', displayText: 'Year Planted' },
    { columnName: 'dateOpenTapping', displayText: 'Date Open Tapping' },
    { columnName: 'initialTreeStand', displayText: 'Initial Tree Stand' },
    { columnName: 'totalTask', displayText: 'Total Task' }
  ];

  constructor(
    private fieldStatusService: FieldStatusService,
    private cloneService: CloneService,
    private fieldService: FieldService,
    private fieldCloneService: FieldCloneService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private fieldConversionService: FieldConversionService,
    private authGuard: AuthGuard,
    private location: Location,
    private fieldDiseaseService: FieldDiseaseService,
    private myLesenService: MyLesenIntegrationService,
    private fieldInfectedService: FieldInfectedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getCrop()
    this.getClone()
    this.getEstate()
    this.getFieldDisease()
    this.role = this.sharedService.role
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

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const fields = Response
          this.fields = fields.filter(x => x.estateId == this.estate.id)

          // Fetch all field infected data
          this.fieldInfectedService.getFieldInfected().subscribe(
            allFieldInfectedData => {
              // Filter field infected data based on field id and store in result object
              fields.forEach(field => {
                const filteredData = allFieldInfectedData.filter(data => data.fieldId === field.id && data.isActive == true);
                this.result[field.id] = filteredData;

              });
            })
          this.sum(this.fields)
        }
      )
      this.subscriptionService.add(getField);
      
  }

  toggleSelectedField(field: Field) {
    if (this.selectedField && this.selectedField.id === field.id) {
      this.selectedField = null
    } else {
      this.selectedField = field
      this.getConversion(this.selectedField)
    }
  }

  getConversion(field: Field) {
    const getConversion = this.fieldConversionService.getConversion()
      .subscribe(
        Response => {
          const conversion = Response
          this.conversionField = conversion.filter(x => x.fieldId == field.id)
        }
      )
      this.subscriptionService.add(getConversion);
    
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  initialForm() {
    this.field.isMature = null
    this.field.fieldStatusId = 0
    this.field.cloneId = 0
    this.field.dateOpenTapping = null
    this.field.fieldName = ''
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

  onSubmit() {
    if (this.field.fieldName == '') {
      swal.fire({
        text: 'Please fil up the form',
        icon: 'error'
      });
    }
    else {
      this.field.estateId = this.estate.id
      this.field.isActive = true
      this.field.createdBy = this.sharedService.userId.toString()
      this.field.createdDate = new Date()
      this.field.dateOpenTapping = this.field.dateOpenTapping
      this.fieldService.addField(this.field)
        .subscribe(
          {
            next: (Response) => {
              const combineClone: any[] = this.selectedValues.map(item => {
                return { 'cloneId': item.id, 'isActive': true, 'fieldId': Response.id, 'createdBy': Response.createdBy, 'createdDate': Response.createdDate }
              })
              this.fieldCloneService.addFieldClone(combineClone)
                .subscribe(
                  Response => {
                    swal.fire({
                      title: 'Done!',
                      text: 'Field successfully submitted!',
                      icon: 'success',
                      showConfirmButton: false,
                      timer: 1000
                    });
                    this.selectedValues = []
                    this.field = {} as Field
                    this.ngOnInit()
                  })
            }, error: (err) => {
              swal.fire({
                text: 'Please fil up the form',
                icon: 'error'
              });
            }
          });
    }
  }

  getcategory() {
    this.filterCropCategories = this.cropCategories.filter(c => c.isMature == this.field.isMature
      && c.isActive == true
      && !(c.fieldStatus.toLowerCase().includes("conversion") && c.isMature == true))
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

  getCrop() {
    const getCrop = this.fieldStatusService.getFieldStatus()
      .subscribe(
        Response => {
          this.cropCategories = Response
        });
      this.subscriptionService.add(getCrop);

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

  sum(data: Field[]) {
    const filteredFields = data.filter(field => !this.result[field.id]);
    // Calculate sum excluding filtered fields
    this.value = filteredFields.filter(x => x.isActive && !x.fieldStatus.toLowerCase().includes('conversion to other crop') && !x.fieldStatus.toLowerCase().includes('abandoned'));
    this.total = this.value.reduce((acc, item) => acc + item.area, 0);
  }

  back() {
    this.location.back()
  }

  compareClones(clone1: any, clone2: any): boolean {
    return clone1 && clone2 ? clone1.id === clone2 : clone1 === clone2;
  }

  diseaseName(fieldStatusId: any) {
    if (this.field.isMature == true) {
      const fieldSick = this.cropCategories.find(x => x.fieldStatus.toLowerCase().includes("infected") && x.isMature == true);
      if (fieldStatusId.value == fieldSick?.id) {
        this.fieldSick = true
      }
      else {
        this.fieldSick = false
      }
    }
    else if (this.field.isMature == false) {
      const fieldSick = this.cropCategories.find(x => x.fieldStatus.toLowerCase().includes("infected") && x.isMature == false);
      if (fieldStatusId.value == fieldSick?.id) {
        this.fieldSick = true
      }
      else {
        this.fieldSick = false
      }
    }

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
