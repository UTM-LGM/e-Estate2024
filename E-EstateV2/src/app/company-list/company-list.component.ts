import { Component, OnInit } from '@angular/core';
import { Company } from '../_interface/company';
import { CompanyService } from '../_services/company.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent implements OnInit {
  companies: any[] = []
  activeCompanies: Company[] = []
  inactiveCompanies: Company[] = []

  pageNumber = 1
  isLoading = true
  term = ''
  showDefault = true
  showActive = false
  showInactive = false
  isBtnActive = false
  isBtnInactive = false

  constructor(
    private companyService: CompanyService,
    private mylesenService: MyLesenIntegrationService
  ) { }

  ngOnInit() {
    this.getCompany()
  }

  getCompany() {
    setTimeout(() => {
      this.mylesenService.getAllCompany()
        .subscribe(
          Response => {
            this.companies = Response
            this.isLoading = false
          }
        )
    }, 2000)
  }

  filterActive(active: boolean) {
    this.activeCompanies = this.companies.filter(x => x.isActive == active)
    this.showDefault = false
    this.showInactive = false
    this.showActive = true
    this.isBtnActive = true
    this.isBtnInactive = false
  }

  filterInactive(inactive: boolean) {
    this.inactiveCompanies = this.companies.filter(x => x.isActive == inactive)
    this.showDefault = false
    this.showActive = false
    this.showInactive = true
    this.isBtnInactive = true
    this.isBtnActive = false

  }

  clearFilter() {
    this.term = ''
    this.showActive = false
    this.showInactive = false
    this.showDefault = true
    this.isBtnInactive = false
    this.isBtnActive = false
  }
}
