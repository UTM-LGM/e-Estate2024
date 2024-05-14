import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CostType } from '../_interface/costType';
import { CostTypeService } from '../_services/cost-type.service';
import swal from 'sweetalert2';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-cost-info',
  templateUrl: './cost-info.component.html',
  styleUrls: ['./cost-info.component.css'],
})
export class CostInfoComponent implements OnInit, OnDestroy {
  activeButton = ''
  clickedCostTypeId = 1
  selectedYear = ''

  estate: any = {} as any

  costType: CostType[] = []
  isLoading = true;

  @Output() yearChanged = new EventEmitter<string>()

  constructor(
    private route: ActivatedRoute,
    private costTypeService: CostTypeService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.getEstate()
    this.getCostType()
  }

  yearSelected() {
    const yearAsString = this.selectedYear.toString()
    if (yearAsString.length === 4) {
      this.yearChanged.emit(this.selectedYear)
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.selectedYear = ''
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

  buttonClicked(costType: string, id: number) {
    this.activeButton = costType
    this.clickedCostTypeId = id
  }

  getCostType() {
    const getCostType = this.costTypeService.getCostType()
      .subscribe(
        Response => {
          const costType = Response
          this.costType = costType.filter(x => x.isActive == true)
        }
      )
    this.subscriptionService.add(getCostType);
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
