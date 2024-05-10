import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { Field } from '../_interface/field';
import { FieldConversionService } from '../_services/field-conversion.service';
import { FieldConversion } from '../_interface/fieldConversion';
import { FieldService } from '../_services/field.service';
import { FieldInfectedService } from '../_services/field-infected.service';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-report-field-information',
  templateUrl: './report-field-information.component.html',
  styleUrls: ['./report-field-information.component.css']
})
export class ReportFieldInformationComponent implements OnInit {

  role = ''
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  total = 0
  isLoading = true
  fields: Field[] = []
  allFields: Field[] = []
  result: any = {} as any
  selectedField: any


  value: Field[] = []
  estate: any = {} as any
  company: any = {} as any
  companies: any[] = []
  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []

  conversionField: FieldConversion[] = [];

  showAll: boolean = false;

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
    private myLesenService: MyLesenIntegrationService,
    private fieldConversionService: FieldConversionService,
    private fieldService: FieldService,
    private fieldInfectedService: FieldInfectedService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.getAllCompanies()
    this.getField()
    if (this.role == "CompanyAdmin") {
      this.estate.companyId = this.sharedService.companyId
      this.getAllEstate()
      this.getCompany()
    }
    else if (this.role == "EstateClerk") {
      this.estate.id = this.sharedService.estateId
      this.getEstate()
    }
  }

  getAllCompanies() {
    this.myLesenService.getAllCompany()
      .subscribe(
        Response => {
          this.companies = Response
        }
      )
  }

  getCompany() {
    this.myLesenService.getOneCompany(this.estate.companyId)
      .subscribe(
        Response => {
          this.company = Response
          this.isLoading = false
        }
      )
  }

  getField() {
    setTimeout(() => {
      this.fieldService.getField()
          .subscribe(
            Response => {
              const fields = Response
              this.allFields = Response
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
              this.isLoading = false;
            }
          )
      // if (this.estate.companyId == undefined) {
      //   this.isLoading = false
      //   this.fields = []
      // }
      // else {
      //   this.fieldService.getField()
      //     .subscribe(
      //       Response => {
      //         const fields = Response
      //         this.allFields = Response
      //         this.fields = fields.filter(x => x.estateId == this.estate.id)
      //         // Fetch all field infected data
      //         this.fieldInfectedService.getFieldInfected().subscribe(
      //           allFieldInfectedData => {
      //             // Filter field infected data based on field id and store in result object
      //             fields.forEach(field => {
      //               const filteredData = allFieldInfectedData.filter(data => data.fieldId === field.id && data.isActive == true);
      //               this.result[field.id] = filteredData;
      //             });
      //           })
      //         this.sum(this.fields)
      //         this.isLoading = false;
      //       }
      //     )
      // }
    }, 2000)
  }

  sum(data: Field[]) {
    const filteredFields = data.filter(field => !this.result[field.id]);
    this.value = filteredFields.filter(x => x.isActive && !x.fieldStatus.toLowerCase().includes('conversion to other crop') && !x.fieldStatus.toLowerCase().includes('abandoned'));
    this.total = this.value.reduce((acc, item) => acc + item.area, 0);
  }

  companySelected() {
    this.estate.id = 0
    this.getAllEstate()
    this.fields = []
    this.total = 0
    this.showAll = false;
  }

  estateSelected() {
    this.fields = []
    this.isLoading = true
    setTimeout(() => {
      this.getField();
    }, 200)
  }

  getAllEstate() {
    this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterLGMAdmin = Response.filter(x => x.companyId == this.estate.companyId)
          this.filterCompanyAdmin = Response.filter(x => x.companyId == this.estate.companyId)
        }
      )
  }

  getEstate() {
    this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
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
    this.fieldConversionService.getConversion()
      .subscribe(
        Response => {
          const conversion = Response
          this.conversionField = conversion.filter(x => x.fieldId == field.id)
        }
      )
  }

  toggleShowAll(){
    if (this.showAll) {
      this.estate.companyId = null
      this.estate.id = null
      // If showAll is true, display all fields
      this.fields = this.allFields;
    } else {
      // If showAll is false, display no fields
      this.fields = [];
    }
  }
}
