import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { CompanyService } from 'src/app/_services/company.service';
import { EstateService } from 'src/app/_services/estate.service';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-home-company-admin',
  templateUrl: './home-company-admin.component.html',
  styleUrls: ['./home-company-admin.component.css']
})
export class HomeCompanyAdminComponent implements OnInit {

  totalEstate = 0
  totalCrop = 0
  companyId = ''

  filterEstates: Estate[] = []

  company: Company = {} as Company

  filterProductions: FieldProduction[] = []

  isLoadingEstate = true
  isLoadingProduction = true
  isLoadingEstateName = true

  constructor(
    private estateService: EstateService,
    private sharedService: SharedService,
    private companyService: CompanyService,
    private fieldProductionService: FieldProductionService,
    private authGuard: AuthGuard
  ) { }

  ngOnInit() {
    if(this.authGuard.getRole() != "Admin")
    {
      this.companyId = this.authGuard.getCompanyId()
      this.getCompany()
      this.getEstate()
      this.getProduction()
    }
  }

  getCompany() {
    this.companyService.getOneCompany(parseInt(this.companyId))
      .subscribe(
        Response => {
          this.company = Response
          this.isLoadingEstateName = false
        }
      )
  }

  getEstate() {
    this.estateService.getEstate()
      .subscribe(
        Response => {
          const estates = Response
          this.filterEstates = estates.filter(x => x.companyId == this.sharedService.companyId && x.isActive == true)
          this.totalEstate = this.filterEstates.length
          this.isLoadingEstate = false
        }
      )
  }

  getProduction() {
    this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          const productions = Response
          this.filterProductions = productions.filter(x => x.estateId == this.sharedService.estateId)
          this.totalCrop = this.filterProductions.reduce((acc, item) => {
            const cuplump = item.cuplump || 0
            const cuplumpDRC = item.cuplumpDRC || 0
            const latex = item.latex || 0
            const latexDRC = item.latexDRC || 0
            const others = item.others || 0
            const othersDRC = item.othersDRC || 0
            const cuplumpDry = (cuplump * (cuplumpDRC / 100))
            const latexDry = (latex * (latexDRC / 100))
            const othersDry = (others * (othersDRC / 100))
            return acc + cuplumpDry + latexDry + othersDry
          }, 0)
          this.isLoadingProduction = false
        }
      )
  }

}
