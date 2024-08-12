import { Component, OnDestroy, OnInit } from '@angular/core';
import { Estate } from '../_interface/estate';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-estate-list',
  templateUrl: './estate-list.component.html',
  styleUrls: ['./estate-list.component.css'],
})
export class EstateListComponent implements OnInit, OnDestroy {
  estates: any[] = []
  activeEstates: Estate[] = []
  inactiveEstates: Estate[] = []

  term = ''
  pageNumber = 1
  isLoading = true
  showDefault = true
  showActive = false
  showInactive = false
  isBtnActive = false
  isBtnInactive = false

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getEstate()
  }

  getEstate() {
    setTimeout(() => {
      const getAllEstate = this.myLesenService.getAllEstate()
        .subscribe(
          Response => {
            this.estates = Response
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getAllEstate);

    }, 2000)
  }

  filterActive(active: boolean) {
    this.activeEstates = this.estates.filter(x => x.isActive == active)
    this.showDefault = false
    this.showInactive = false
    this.showActive = true
    this.isBtnActive = true
    this.isBtnInactive = false
  }

  filterInactive(inactive: boolean) {
    this.inactiveEstates = this.estates.filter(x => x.isActive == inactive)
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
