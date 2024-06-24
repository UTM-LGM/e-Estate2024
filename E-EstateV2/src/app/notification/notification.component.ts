import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { BadgeService } from '../_services/badge.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductionComparisonComponent } from '../production-comparison/production-comparison.component';
import { ProductionComparisonService } from '../_services/production-comparison.service';
import { ProductionComparison } from '../_interface/productionComparison';
import { FieldInfoYearlyService } from '../_services/field-info-yearly.service';
import { FieldInfoYearly } from '../_interface/fieldInfoYearly';
import { SharedService } from '../_services/shared.service';
import { SubscriptionService } from '../_services/subscription.service';
import { DatePipe } from '@angular/common';
import { FieldProductionService } from '../_services/field-production.service';
import { CostAmountService } from '../_services/cost-amount.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  showAlertField = false
  showAlertProduction = false
  showEmptyMessage = false
  yearNow = 0
  estateId = 0
  sumTotalDryPreviousMonthYear = 0
  sumTotalDryCurrentMonthYear = 0
  message = ''

  responsePreviousMonthYear: any[] = []
  responseCurrentMonthYear: any[] = []

  filterProduction: ProductionComparison[] = []
  fieldInfo: FieldInfoYearly[] = []

  warningProductionDrafted = false
  warningCostDrafted = false

  constructor(
    private reportService: ReportService,
    private badgeService: BadgeService,
    private dialog: MatDialog,
    private productionComparisonService: ProductionComparisonService,
    private fieldInfoYearlyService: FieldInfoYearlyService,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe,
    private productionService:FieldProductionService,
    private costInformationService:CostAmountService,

  ) { }

  ngOnInit() {
    this.yearNow = new Date().getFullYear()
    this.estateId = this.sharedService.estateId
    this.checkProduction()
    // this.getFieldInfoYearly()
    this.getProductionDrafted()
    // this.getCostDrafted()
  }

  getProductionDrafted(){
    const previousMonth = new Date()
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const date = this.datePipe.transform(previousMonth, 'MMM-yyyy')
    const getProduction = this.productionService.getProduction()
    .subscribe(
      Response =>{
        const production = Response.filter(x=>x.estateId == this.sharedService.estateId && x.status == "Draft" && x.monthYear == date)
        if(production.length > 0)
          {
            
            this.warningProductionDrafted = true
            this.updateBadge()
          }
      }
    )
    this.subscriptionService.add(getProduction);
  }

  // getCostDrafted(){
  //   const getCostAmount = this.costInformationService.getCostAmount()
  //   .subscribe(
  //     Response =>{
  //       const cost = Response.filter(x=>x.estateId == this.estateId && x.status == "Draft" && x.monthYear == new Date().getFullYear())
  //       if(cost.length > 0){
  //         this.warningCostDrafted = true
  //         this.updateBadge()
  //       }
  //     }
  //   )
  //   this.subscriptionService.add(getCostAmount);

  // }

  checkProduction() {
    const currentDate = new Date().getFullYear()
    const getProductivity = this.reportService.getEstateProductivityByField(currentDate.toString())
      .subscribe(
        (Response: any) => {
          const production = Response.production
          const previousMonthYear = Response.monthYear
          this.responsePreviousMonthYear = previousMonthYear.filter((x: any) => x.estateId == this.estateId)
          const filterProduction = production.filter((x: { estateId: number; }) => x.estateId == this.estateId)
          const totalDry = filterProduction.map((x: any) => x.cuplumpDry + x.latexDry + x.ussDry + x.othersDry)
          this.sumTotalDryPreviousMonthYear = totalDry.reduce((acc: number, value: number) => acc + value, 0)

          const getEstateProductivity = this.reportService.getEstateProductivityByField(currentDate.toString())
            .subscribe(
              (Response: any) => {
                const production = Response.production
                const currentMonthYear = Response.monthYear
                this.responseCurrentMonthYear = currentMonthYear.filter((x: any) => x.estateId == this.estateId)
                const filterProduction = production.filter((x: { estateId: number; }) => x.estateId == this.estateId)
                const totalDry = filterProduction.map((x: any) => x.cuplumpDry + x.latexDry + x.ussDry + x.othersDry)
                this.sumTotalDryCurrentMonthYear = totalDry.reduce((acc: number, value: number) => acc + value, 0);

                const getComparison = this.productionComparisonService.getProductionComparison()
                  .subscribe(
                    Response => {
                      const production = Response
                      this.filterProduction = production.filter(x => x.estateId == this.estateId)
                      const today = new Date()
                      const isNovember = today.getMonth() === 1
                      if (this.responsePreviousMonthYear.some((item) => item.monthYear.includes('Dec')) &&
                        this.responseCurrentMonthYear.some((item) => item.monthYear.includes('Dec')) && this.filterProduction.length == 0 
                        && isNovember) {
                        if (this.sumTotalDryCurrentMonthYear < this.sumTotalDryPreviousMonthYear) {
                          this.message = 'lower'
                        }
                        else if (this.sumTotalDryCurrentMonthYear > this.sumTotalDryPreviousMonthYear) {
                          this.message = 'higher'
                        }
                        this.showAlertProduction = true
                        this.updateBadge()
                      }
                      this.updateBadge()
                    }
                  )
                this.subscriptionService.add(getComparison);

              }
            )
          this.subscriptionService.add(getEstateProductivity);

        }
      )
    this.subscriptionService.add(getProductivity);

  }

  updateBadge() {
    const badgeCount = (this.showAlertField ? 1 : 0) + (this.showAlertProduction ? 1 : 0) + (this.warningProductionDrafted ? 1 : 0) + (this.warningCostDrafted ? 1:0)
    this.badgeService.updateBadgeCount(badgeCount)
    if (badgeCount == 0) {
      this.showEmptyMessage = true
    }
  }

  openDialog(currentYear: number, previousYear: number) {
    const dialogRef = this.dialog.open(ProductionComparisonComponent, {
      data: { data: currentYear, previousYear },
    });

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          setTimeout(() => {
            location.reload()
          }, 1000);
        }
      )
  }

  getFieldInfoYearly() {
    const today = new Date()
    const isNovember = today.getMonth() === 1 // Note: JavaScript months are 0-based
    const getExtra = this.fieldInfoYearlyService.getExtraFieldInfo(this.yearNow)
      .subscribe(
        Response => {
          this.fieldInfo = Response
          //December every year can see
          if (this.fieldInfo.length == 0) {
            this.showAlertField = true
          }
        }
      )
      this.subscriptionService.add(getExtra);

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
