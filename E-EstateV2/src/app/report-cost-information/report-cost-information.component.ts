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
  selectedEstateName = ''
  startMonth = ''
  endMonth = ''

  totalAmount = 0
  isLoading = true
  radioButton = false

  costType = 'all'
  costTypeSub = ''


  companies: any[] = []
  estate: any = {} as any
  company: any = {} as any
  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  costInformations: any[] = []
  filteredCostInformation: any[] = []

  showAll = false

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
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.isLoading = false
    this.getAllCompanies()
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

  monthChange() {
    this.isLoading = true
    this.getCostInformation()
    this.costType = 'all'
    this.costTypeSub = 'allSub'
  }

  chageStartMonth() {
    this.endMonth = ''
    this.costInformations = []
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
    this.filteredCostInformation = []
    this.startMonth = ''
    this.endMonth = ''
    this.showAll = false
    this.radioButton = false;
  }

  estateSelected() {
    this.filteredCostInformation = []
    this.selectedEstateName = this.filterLGMAdmin.find(e => e.id === this.estate.id)?.name || '';
    this.startMonth = ''
    this.endMonth = ''
    this.radioButton = false;

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
      this.totalAmount = 0
      const getCostInformation = this.reportService.getAllCostInformation(this.startMonth, this.endMonth)
        .subscribe(
          Response => {
            let groupedResponse = [];
            if (this.estate.id == null) {
              groupedResponse = Response.reduce((acc, obj) => {
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
              this.filteredCostInformation = this.costInformations
              this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
              this.showAll = true
            } else {
              groupedResponse = Response.filter(x => x.estateId == this.estate.id).reduce((acc, obj) => {
                const existingItem = acc.find((item: any) => item.costId === obj.costId);
                if (existingItem) {
                  existingItem.amount += obj.amount;
                } else {
                  acc.push({
                    costId: obj.costId,
                    amount: obj.amount,
                    costCategory: obj.costCategory,
                    costSubcategories1: obj.costSubcategories1,
                    costSubcategories2: obj.costSubcategories2,
                    costType: obj.costType,
                    isMature: obj.isMature,
                    estateId: obj.estateId
                  });
                }
                return acc
              }, [])
              this.costInformations = groupedResponse
              this.filteredCostInformation = this.costInformations
              this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
            }
            this.isLoading = false;
            this.radioButton = true;
          }
        )
      this.subscriptionService.add(getCostInformation);

    }, 2000);
  }

  reset() {
    if (this.role == 'Admin' || this.role == 'Management') {
      this.estate.companyId = null
      this.estate.id = null
      this.startMonth = ''
      this.endMonth = ''
      this.filteredCostInformation = [];
      this.radioButton = false
      this.costType = 'all'
      this.costTypeSub = 'allSub'
      this.totalAmount = 0
    }
  }

  exportToExcelYear(data: any[], fileName: String) {
    if (this.estate.id != undefined) {
      if (this.role == 'EstateClerk') {
        this.selectedEstateName = this.estate.name
      }
      let bilCounter = 1
      const filteredData: any = data.map(row => ({
        No: bilCounter++,
        CostType: this.formatCostType(row.costType),
        Maturity: row.isMature ? "Mature" : "Immature",
        CostCategory: row.costCategory,
        CostSubCategory1: row.costSubcategories1,
        CostSubCategory2: row.costSubcategories2,
        Amount: row.amount,
      }))

      const headerRow = [
        { No: 'Start Month Year:', CostType: this.startMonth },
        { No: 'End Month Year:', CostType: this.endMonth },
        {}, // Empty row for separation
        {
          No: 'No', CostType: 'CostType', Maturity: 'Maturity', CostCategory: 'CostCategory',
          CostSubCategory1: 'CostSubCategory1', CostSubCategory2: 'CostSubcategory2', Amount: 'Amount'
        }
      ];

      const footerRow = [{ Amount: this.totalAmount, No: '', CostType: '', Maturity: '', CostCategory: '', CostSubCategory1: '', CostSubCategory2: 'Total Amount:' }];

      const exportData = headerRow.concat(filteredData);

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...exportData, ...footerRow], { skipHeader: true });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

      XLSX.writeFile(wb, formattedFileName);
    }

    else {
      let bilCounter = 1
      const filteredData: any = data.map(row => ({
        No: bilCounter++,
        CostType: this.formatCostType(row.costType),
        Maturity: row.isMature ? "Mature" : "Immature",
        CostCategory: row.costCategory,
        CostSubCategory1: row.costSubcategories1,
        CostSubCategory2: row.costSubcategories2,
        Amount: row.totalAmount,
      }))

      const totalAmount = filteredData.reduce((sum: any, row: any) => sum + row.totalAmount, 0);


      const headerRow = [
        { No: 'Start Month Year:', State: this.startMonth },
        { No: 'End Month Year:', State: this.endMonth },
        {}, // Empty row for separation
        {
          No: 'No', CostType: 'CostType', Maturity: 'Maturity', CostCategory: 'CostCategory',
          CostSubCategory1: 'CostSubCategory1', CostSubCategory2: 'CostSubCategory2', Amount: 'Amount'
        }
      ];

      const footerRow = [{ Amount: this.totalAmount, No: '', CostType: '', Maturity: '', CostCategory: '', CostSubCategory1: '', CostSubCategory2: 'Total Amount:' }];


      const exportData = headerRow.concat(filteredData);

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...exportData, ...footerRow], { skipHeader: true });
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }

  }

  formatCostType(costType: string): string {
    if (costType === 'DIRECT COST') {
      return 'Direct Cost';
    } else if (costType === 'INDIRECT COST') {
      return 'Indirect Cost';
    } else {
      return costType;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  OnRadioChange() {

    this.costTypeSub = 'allSub'
    if (this.costType === 'all') {
      this.filteredCostInformation = this.costInformations.filter(x => x.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costType === 'mature') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.isMature == true && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costType === 'immature') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.isMature == false && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costType === 'indirect') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costType == "INDIRECT COST" && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    }
  }

  OnRadioChangeSub() {
    if (this.costTypeSub === 'allSub') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.isMature == true && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costTypeSub === 'manuring') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costSubcategories1 == "Manuring" && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costTypeSub === 'weeding') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costSubcategories1 == "Weeding" && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costTypeSub === 'others') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costSubcategories1.includes("Others") && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costTypeSub === 'tapping') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costSubcategories1.includes("Tapping") && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costTypeSub === 'stimulation') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costSubcategories1 == "Stimulation" && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    } else if (this.costTypeSub === 'transport') {
      this.filteredCostInformation = this.costInformations.filter(cost => cost.costSubcategories1.includes("Transport") && cost.estateId == this.estate.id);
      this.totalAmount = 0
      if (this.showAll == true) {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.totalAmount, 0);
      } else {
        this.totalAmount = this.filteredCostInformation.reduce((total, cost) => total + cost.amount, 0);
      }
    }
  }


  // shouldApplyFixedWidth(column: any): boolean {
  //   // Adjust condition based on your specific columns
  //   return column.columnName === 'costSubCategories2' || column.columnName === 'costSubCategories1';
  // }

  getColumnStyle(columnName: string) {
    switch (columnName) {
      case 'no':
        return { 'width': '10px' };
      case 'costType':
      case 'isMature':
        return { 'width': '50px' };
      case 'costCategory':
      case 'costSubCategories1':
      case 'amount':
        return { 'width': '100px' };
      case 'costSubCategories2':
        return { 'width': '170px' };
      default:
        return {};
    }
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

}
