import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { CompanyService } from 'src/app/_services/company.service';
import { EstateService } from 'src/app/_services/estate.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clone-productivity-yearly',
  templateUrl: './clone-productivity-yearly.component.html',
  styleUrls: ['./clone-productivity-yearly.component.css']
})
export class CloneProductivityYearlyComponent implements OnInit {

  filterProductionYearly: FieldProduction[] = []
  productionYearly: FieldProduction[] = []
  monthYear: FieldProduction[] = []
  responseMonthYear: FieldProduction[] = []

  filterEstatesClerk: Estate[] = []
  filterEstatesAdmin: Estate[] = []
  filterEstatesCompanyAdmin: Estate[] = []

  filteredCompanies: Company[] = []

  totalDry: any[] = []

  estate: Estate = {} as Estate

  isLoading = false

  year = ''
  role = ''
  term = ''
  pageNumber = 1

  constructor(
    private estateService: EstateService,
    private sharedService: SharedService,
    private auth: AuthGuard,
    private companyService: CompanyService,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.role = this.auth.getRole()
    if (this.role == 'EstateClerk') {
      this.estate.id = this.sharedService.estateId
    } else {
      this.estate.id = 0
    }
    this.estate.companyId = 0
    this.getAllCompany()
    this.getAllEstate()

  }

  companySelected() {
    this.year = ''
    this.estate.id = 0
    this.filterProductionYearly = []
    this.getAllEstate()
  }

  getAllEstate() {
    this.estateService.getEstate()
      .subscribe(
        Response => {
          const estates = Response
          this.filterEstatesClerk = estates.filter((x => x.id == this.sharedService.estateId && x.isActive == true))
          this.filterEstatesCompanyAdmin = estates.filter(x => x.companyId == this.sharedService.companyId && x.isActive == true)
          this.filterEstatesAdmin = estates.filter(x => x.isActive == true && x.companyId == this.estate.companyId)
        }
      )
  }

  getAllCompany() {
    this.companyService.getCompany()
      .subscribe(
        Response => {
          const companies = Response
          this.filteredCompanies = companies.filter(x => x.isActive == true)
        }
      )
  }

  estateSelected() {
    this.year = ''
    this.filterProductionYearly = []
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
    }
  }

  getProductionYearly() {
    setTimeout(() => {
      this.reportService.getProductivityByClone(this.year)
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
            this.isLoading = false
          })
    }, 2000)
  }

}
