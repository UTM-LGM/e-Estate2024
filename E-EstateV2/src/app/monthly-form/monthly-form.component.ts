import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';
import { DatePipe } from '@angular/common';
import { EstateDetailService } from '../_services/estate-detail.service';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';


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
  previousMonth = new Date()
  // date: any
  estateDetail: any = {} as any

  selectedMonth: any = ''

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe,
    private estateService: EstateDetailService,
    private router: Router,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDate()
    this.selectedMonth = this.datePipe.transform(this.previousMonth, 'yyyy-MM');
    this.getEstate()
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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
