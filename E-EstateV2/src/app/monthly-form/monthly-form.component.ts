import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-monthly-form',
  templateUrl: './monthly-form.component.html',
  styleUrls: ['./monthly-form.component.css']
})
export class MonthlyFormComponent implements OnInit, OnDestroy {

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  isLoading = true
  estate: any = {} as any
  isProductionTabDisabled = false;
  isLaborTabDisabled = true;
  isLaborShortageTabDisabled = true;

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.getEstate()
  }


  goToNextTab() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 1; // Go to the next tab (index 1 is the Labor tab)
      this.isLaborTabDisabled = false;
      this.isProductionTabDisabled = true;
    }
  }

  goToNextTab1() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 2; // Go to the next tab (index 1 is the Labor tab)
      this.isLaborShortageTabDisabled = false;
      this.isLaborTabDisabled = true;
    }
  }

  goToBackTab() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0; // Go to the back tab (index 0 is the production tab)
      this.isLaborTabDisabled = true;
      this.isProductionTabDisabled = false;
    }
  }

  goToBackTab1() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 1; // Go to the back tab (index 0 is the production tab)
      this.isLaborShortageTabDisabled = true;
      this.isLaborTabDisabled = false;
    }
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response;
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
