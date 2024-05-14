import { Component, OnDestroy, OnInit } from '@angular/core';
import { Estate } from '../_interface/estate';
import { EstateStatus } from '../_interface/estateStatus';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.css'],
})
export class EstateComponent implements OnInit,OnDestroy {
  estates: Estate[] = []

  company: any = {} as any

  history: EstateStatus = {} as EstateStatus

  term = ''
  pageNumber = 1
  isLoading = true
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'name', displayText: 'Estate Name' },
    { columnName: 'state', displayText: 'State' },
    { columnName: 'town', displayText: 'Town' },
    { columnName: 'email', displayText: 'Email' },
  ];

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getCompany()
  }

  getCompany() {
    setTimeout(() => {
      this.route.params.subscribe((routeParams) => {
        if (routeParams['id'] != null) {
          const getOneCompany = this.myLesenService.getOneCompany(routeParams['id'])
            .subscribe(
              Response => {
                this.company = Response
                this.isLoading = false
              }
            )
          this.subscriptionService.add(getOneCompany);

        }
      });
    }, 2000)
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}