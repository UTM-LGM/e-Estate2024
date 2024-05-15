import { Component, OnInit } from '@angular/core';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-rubber-production-yearly',
  templateUrl: './rubber-production-yearly.component.html',
  styleUrls: ['./rubber-production-yearly.component.css']
})
export class RubberProductionYearlyComponent implements OnInit {

  term = ''
  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1
  role = ''
  year = ''

  totalCuplumpDry = 0
  totalLatexDry = 0
  totalAllDry = 0

  estate: any = {} as any
  companies: any[] = []
  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  company: any = {} as any

  filterProductionYearly: FieldProduction[] = []


  sortableColumns = [
    { columnName: 'monthYear', displayText: 'Month and Year' },
    { columnName: 'cuplump', displayText: 'Cuplump dry (Kg)' },
    { columnName: 'latex', displayText: 'Latex dry (Kg)' },
    { columnName: 'totalProduction', displayText: 'Total Production dry monthly (Kg)' },
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService: ReportService,
    private sharedService: SharedService

  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.getAllCompanies()
    this.getProductionYearly()
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

  getEstate() {
    this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
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

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  companySelected() {
    this.estate.id = 0
    this.getAllEstate()
    this.filterProductionYearly = []
  }

  estateSelected() {
    this.filterProductionYearly = []
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

  yearSelected() {
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.getProductionYearly()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
    }
  }

  getProductionYearly() {
    setTimeout(() => {
      if (this.year == '') {
        this.isLoading = false
        this.filterProductionYearly = []
      }
      else {
        this.reportService.getProductionYearly(this.year)
          .subscribe(
            (Response: any) => {
              const productionYearly = Response
              this.filterProductionYearly = productionYearly.filter((item: any) => item.estateId == this.estate.id)
              this.filterProductionYearly.forEach(fil =>
                fil.totalDry = fil.cuplumpDry + fil.latexDry + fil.ussDry + fil.othersDry
              )
              this.totalCuplumpDry = this.filterProductionYearly.reduce((total, item) => total + item.cuplumpDry, 0)
              this.totalLatexDry = this.filterProductionYearly.reduce((total, item) => total + item.latexDry, 0)
              this.totalAllDry = this.filterProductionYearly.reduce((total, item)=> total + item.totalDry, 0)

              this.isLoading = false
            })
      }
    }, 2000)
  }

}
