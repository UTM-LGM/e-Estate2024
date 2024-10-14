import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../_interface/company';
import { CompanyService } from '../_services/company.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent implements OnInit, OnDestroy {
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
    private mylesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.getCompany()
  }

  getCompany() {
    setTimeout(() => {
      const getCompany = this.mylesenService.getAllCompany()
        .subscribe(
          Response => {
            this.companies = Response
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getCompany);

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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }
}
