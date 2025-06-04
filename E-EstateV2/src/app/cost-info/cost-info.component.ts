import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CostType } from '../_interface/costType';
import { CostTypeService } from '../_services/cost-type.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';
import { DatePipe } from '@angular/common';
import { EstateDetailService } from '../_services/estate-detail.service';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cost-info',
  templateUrl: './cost-info.component.html',
  styleUrls: ['./cost-info.component.css'],
})
export class CostInfoComponent implements OnInit, OnDestroy {
  activeButton = ''
  clickedCostTypeId = 1
  selectedMonthYear = ''

  estate: any = {} as any

  costType: CostType[] = []
  isLoading = true;
  previousMonth = new Date()
  estateDetail: any = {} as any


  // date: any
  selectedMonth: any = ''


  @Output() yearChanged = new EventEmitter<string>()

  constructor(
    private route: ActivatedRoute,
    private costTypeService: CostTypeService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe,
    private estateService: EstateDetailService,
    private router: Router,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getDate()
    this.selectedMonth = this.datePipe.transform(this.previousMonth, 'yyyy-MM');
    this.getEstate()
    this.getCostType()
  }

  getDate() {
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
  }

  monthSelected(month: string) {
    let today = new Date()
    let monthDate = new Date(month)

    if (monthDate > today) {
      swal.fire({
        icon: 'warning',
        title: 'Invalid Selection',
        text: 'You cannot choose a future production month.',
      }).then(() => {
        // This runs AFTER user closes the alert
        this.selectedMonth = this.datePipe.transform(today, 'yyyy-MM');
        this.cdr.detectChanges();
      });
    }
    else {
      this.selectedMonth = this.datePipe.transform(monthDate, 'yyyy-MM')
    }
  }

  get selectedMonthForTabs(): string {
    return this.datePipe.transform(this.selectedMonth, 'MMM-yyyy') || '';
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response;
                this.checkEstateDetail()
                this.isLoading = false
              }
            )
          this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }

  checkEstateDetail() {
    this.estateService.getEstateDetailbyEstateId(this.sharedService.estateId)
      .subscribe(
        Response => {
          if (Response != null) {
            this.estateDetail = Response;
          } else {
            // If the estate detail is null, show the alert
            swal.fire({
              icon: 'info',
              title: 'Information',
              text: 'Please update Estate Profile in General',
            });
            this.router.navigateByUrl('/estate-detail/' + this.estate.id)
          }
        }
      )
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
