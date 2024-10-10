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

  combineClone: FieldClone[] = []

  conversionField: FieldConversion[] = []

  filterFieldDisease: FieldDisease[] = []
  fields: Field[] = []

  result: any = {} as any

  term = ''
  total = 0
  isLoading = true
  pageNumber = 1
  order = ''
  selectedField: any
  currentSortedColumn = ''
  role = ''
  fieldSick = false

  itemsPerPage = 10

  sortableColumns = [
    { columnName: 'fieldName', displayText: 'Field / Block' },
    { columnName: 'rubberArea', displayText: 'Rubber Area (Ha)' },
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'fieldStatus', displayText: 'Field Status' },
    { columnName: 'yearPlanted', displayText: 'Year Planted' },
    { columnName: 'dateOpenTapping', displayText: 'Date Open Tapping' },
    { columnName: 'initialTreeStand', displayText: 'Initial Tree Stand per Ha' },
    { columnName: 'totalTask', displayText: 'Total Task' }
  ];

  constructor(
    private fieldService: FieldService,
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
          this.isLoading = false

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

  

  sum(data: Field[]) {
    const filteredFields = data.filter(field => !this.result[field.id]);
    // Calculate sum excluding filtered fields
    this.value = filteredFields.filter(x => x.isActive && !x.fieldStatus?.toLowerCase().includes('conversion to other crop') 
    && !x.fieldStatus?.toLowerCase().includes('abandoned') && !x.fieldStatus?.toLowerCase().includes('government')
    && x.isMature == true
  );
    this.total = this.value.reduce((acc, item) => acc + (item.rubberArea ?? 0), 0);
  }

  back() {
    this.location.back()
  }

  compareClones(clone1: any, clone2: any): boolean {
    return clone1 && clone2 ? clone1.id === clone2 : clone1 === clone2;
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
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

  getFieldColor(field: any): string {
    // Return 'red' if the array is empty or if any of the fieldGrants have isActive === false
    if (!field.fieldGrants || field.fieldGrants.length === 0) {
      return 'red';
    }
    return 'blue';
  }

}
