import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-labor-info',
  templateUrl: './labor-info.component.html',
  styleUrls: ['./labor-info.component.css'],
})
export class LaborInfoComponent implements OnInit, OnDestroy {
  previousMonth = new Date()

  estate: any = {} as any

  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    this.getEstate()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.isLoading = false
              }
            )
          this.subscriptionService.add(getOneEstate);

        }
      });
    }, 2000)
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
