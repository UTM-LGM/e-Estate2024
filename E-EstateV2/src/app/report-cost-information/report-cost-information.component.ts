import { Component, OnInit } from '@angular/core';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { ReportService } from '../_services/report.service';

@Component({
  selector: 'app-report-cost-information',
  templateUrl: './report-cost-information.component.html',
  styleUrls: ['./report-cost-information.component.css']
})
export class ReportCostInformationComponent implements OnInit {

  role = ''
  year = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  term = ''
  totalAmount = 0
  isLoading = true

  companies: any[] = []
  estate: any = {} as any
  company: any = {} as any
  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  costInformations: any[] = []

  showAll =false

  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'costType', displayText: 'Cost Type' },
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'costCategory', displayText: 'Cost Category' },
    { columnName: 'costSubCategories1', displayText: 'Cost Subcategory 1' },
    { columnName: 'costSubCategories2', displayText: 'Cost Subcategory 2' },
    { columnName: 'amount', displayText: 'Amount (Rm)' }
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private sharedService: SharedService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.getAllCompanies()
    this.getCostInformation()
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


  companySelected() {
    this.estate.id = 0
    this.getAllEstate()
    this.costInformations = []
    this.year = ''
    this.showAll = false
  }

  estateSelected() {
    this.costInformations = []
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

  yearSelected() {
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.getCostInformation()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
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

  getCostInformation() {
    setTimeout(() => {
      if (this.year == '') {
        this.isLoading = false;
        this.costInformations = [];
      } else {
        this.reportService.getCostInformation(this.year)
          .subscribe(
            Response => {
              if (this.estate.id == null) {
                const groupedResponse = Response.reduce((acc, obj) => {
                  const existingItem = acc.find((item: any) => item.costId === obj.costId);
                  if (existingItem) {
                    existingItem.totalAmount += obj.amount;
                  } else {
                    acc.push({
                      costId: obj.costId,
                      totalAmount: obj.amount,
                      costCategory: obj.costCategory,
                      costSubcategories1: obj.costSubcategories1,
                      costSubcategories2: obj.costSubcategories2,
                      costType: obj.costType,
                      isMature: obj.isMature
                    });
                  }
                  return acc;
                }, []);
                this.costInformations = groupedResponse;
                this.totalAmount = this.costInformations.reduce((total, cost) => total + cost.totalAmount, 0);
                this.showAll = true 
              } else {
                this.costInformations = Response.filter(x => x.estateId == this.estate.id);
                this.totalAmount = this.costInformations.reduce((total, cost) => total + cost.amount, 0);
              }
              this.isLoading = false;
            }
          )
      }
    }, 2000);
  }

  reset(){
    if(this.role == 'Admin')
      {
        this.estate.companyId = null
        this.estate.id = null
        this.year = ''
        this.costInformations = [];
      }
  }
  
}
