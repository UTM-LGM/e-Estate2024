import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { ReportService } from '../_services/report.service';
import { SubscriptionService } from '../_services/subscription.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report-cost-information',
  templateUrl: './report-cost-information.component.html',
  styleUrls: ['./report-cost-information.component.css']
})
export class ReportCostInformationComponent implements OnInit, OnDestroy {

  role = ''
  year = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  itemsPerPage = 20
  term = ''
  selectedEstateName= ''

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
    private reportService: ReportService,
    private subscriptionService:SubscriptionService
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
    const getAllCompany = this.myLesenService.getAllCompany()
      .subscribe(
        Response => {
          this.companies = Response
        }
      )
      this.subscriptionService.add(getAllCompany);

  }

  getCompany() {
    const getOneCompany = this.myLesenService.getOneCompany(this.estate.companyId)
      .subscribe(
        Response => {
          this.company = Response
          this.isLoading = false
        }
      )
      this.subscriptionService.add(getOneCompany);

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
    this.selectedEstateName = this.filterLGMAdmin.find(e => e.id === this.estate.id)?.name || '';
  }


  getAllEstate() {
    const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterLGMAdmin = Response.filter(x => x.companyId == this.estate.companyId)
          this.filterCompanyAdmin = Response.filter(x => x.companyId == this.estate.companyId)
        }
      )
      this.subscriptionService.add(getAllEstate);
    
  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
      this.subscriptionService.add(getOneEstate);
      
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
        const getCostInformation = this.reportService.getCostInformation(this.year)
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
      this.subscriptionService.add(getCostInformation);

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

  exportToExcelYear(data:any[], fileName:String){
    if(this.estate.id != undefined ){
      if(this.role == 'EstateClerk'){
        this.selectedEstateName = this.estate.name
      }
      let bilCounter = 1
      const filteredData = data.map(row =>({
        No:bilCounter++,
        CostType:row.costType,
        Maturity: row.isMature ? "Mature" : "Immature",
        CostCategory: row.costCategory,
        CostSubCategory1:row.costSubcategories1,
        CostSubCategory2:row.costSubcategories2,
        Amout: row.amount,
      }))
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws,this.selectedEstateName);
      XLSX.writeFile(wb, `${this.selectedEstateName} Cost Information Report ${this.year}.xlsx`);
    }

    else{
      let bilCounter = 1
      const filteredData = data.map(row =>({
        No:bilCounter++,
        CostType:row.costType,
        Maturity: row.isMature ? "Mature" : "Immature",
        CostCategory: row.costCategory,
        CostSubCategory1:row.costSubcategories1,
        CostSubCategory2:row.costSubcategories2,
        Amout: row.totalAmount,
      }))
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.year.toString() );
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
    
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
