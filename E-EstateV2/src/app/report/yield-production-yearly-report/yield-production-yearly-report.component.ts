import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';
import { ReportService } from 'src/app/_services/report.service';
import { EstateService } from 'src/app/_services/estate.service';
import { CompanyService } from 'src/app/_services/company.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-yield-production-yearly-report',
  templateUrl: './yield-production-yearly-report.component.html',
  styleUrls: ['./yield-production-yearly-report.component.css']
})
export class YieldProductionYearlyReportComponent implements OnInit, OnDestroy {

  productionYearly: FieldProduction[] = []
  filterProductionYearly: FieldProduction[] = []
  monthYear: FieldProduction[] = []
  responseMonthYear: FieldProduction[] = []

  totalDry: any[] = []
  totalProductivity: any[] = []

  total: any
  value: any

  filteredCompanies: Company[] = []

  filterEstatesClerk: Estate[] = []
  filterEstatesAdmin: Estate[] = []
  filterEstatesCompanyAdmin: Estate[] = []

  estate: Estate = {} as Estate

  isLoading = false

  role = ''
  year = ''
  term = ''
  pageNumber = 1

  constructor(
    private reportService: ReportService,
    private sharedService: SharedService,
    private estateService: EstateService,
    private auth: AuthGuard,
    private companyService: CompanyService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    if (this.role == 'EstateClerk') {
      this.estate.id = this.sharedService.estateId
    } else {
      this.estate.id = 0
    }
    this.estate.companyId = 0
    this.getAllCompany()
    this.getAllEstate()

  }

  getAllCompany() {
    const getCompany = this.companyService.getCompany()
      .subscribe(
        Response => {
          const companies = Response
          this.filteredCompanies = companies.filter(x => x.isActive == true)
        }
      )
      this.subscriptionService.add(getCompany);

  }

  companySelected() {
    this.year = ''
    this.estate.id = 0
    this.filterProductionYearly = []
    this.getAllEstate()
  }

  getAllEstate() {
    const getEstate = this.estateService.getEstate()
      .subscribe(
        Response => {
          const estates = Response
          this.filterEstatesClerk = estates.filter((x => x.id == this.sharedService.estateId && x.isActive == true))
          this.filterEstatesCompanyAdmin = estates.filter(x => x.companyId == this.sharedService.companyId && x.isActive == true)
          this.filterEstatesAdmin = estates.filter(x => x.isActive == true && x.companyId == this.estate.companyId)
        }
      )
      this.subscriptionService.add(getEstate);
    
  }

  yearSelected() {
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.filterProductionYearly = []
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
      const getProductivity = this.reportService.getEstateProductivityByField(this.year)
        .subscribe(
          (Response: any) => {
            this.productionYearly = Response.production
            this.responseMonthYear = Response.monthYear
            this.monthYear = this.responseMonthYear.filter(x => x.estateId == this.estate.id)
            if (this.role == 'Clerk') {
              this.estate.id = this.sharedService.estateId
            }
            this.filterProductionYearly = this.productionYearly.filter(item => item.estateId == this.estate.id)
            this.totalDry = this.filterProductionYearly.map(x => x.cuplumpDry + x.latexDry + x.ussDry + x.othersDry)
            this.totalProductivity = this.filterProductionYearly.map(x => (x.cuplumpDry + x.latexDry + x.ussDry) / x.tappedAreaPerHa)
            this.isLoading = false
          })
      this.subscriptionService.add(getProductivity);

    }, 2000)
  }

  estateSelected() {
    this.year = ''
    this.filterProductionYearly = []
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}