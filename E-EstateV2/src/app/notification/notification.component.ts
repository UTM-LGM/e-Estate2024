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
import { FieldService } from '../_services/field.service';
import { FieldProduction } from '../_interface/fieldProduction';
import { RubberStockService } from '../_services/rubber-stock.service';
import { RubberStock } from '../_interface/rubberStock';
import { EstateContactService } from '../_services/estate-contact.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  showAlertField = false
  showAlertProduction = false
  showEmptyMessage = true
  yearNow = 0
  estateId = 0
  sumTotalDryPreviousMonthYear = 0
  sumTotalDryCurrentMonthYear = 0
  message = ''
  totalCuplumpDry = 0
  totalLatexDry = 0

  totalCuplump: any[] = []
  totalLatex: any[] = []

  responsePreviousMonthYear: any[] = []
  responseCurrentMonthYear: any[] = []

  filterProduction: ProductionComparison[] = []
  fieldInfo: FieldInfoYearly[] = []

  warningProductionDrafted = false
  warningCostDrafted = false
  warningGrantTitle = false
  warningStock = 0
  filterProductions: any[] = []
  filterSales: any[] = []

  rubberStocks: RubberStock[] = []

  filteredResults: any[] = []

  warningContact = false



  constructor(
    private reportService: ReportService,
    private badgeService: BadgeService,
    private dialog: MatDialog,
    private productionComparisonService: ProductionComparisonService,
    private fieldInfoYearlyService: FieldInfoYearlyService,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe,
    private productionService: FieldProductionService,
    private costInformationService: CostAmountService,
    private fieldService: FieldService,
    private rubberStockService: RubberStockService,
    private estateContactService: EstateContactService

  ) { }

  ngOnInit() {
    this.yearNow = new Date().getFullYear()
    this.estateId = this.sharedService.estateId
    this.getProductionDrafted()
    this.getGrantTitle()
    this.getProduction()
    this.getAdditionalContact()
  }

  getProduction() {
    const getAllProduction = this.reportService.getProduction()
      .subscribe(
        Response => {
          const productions = Response
          this.filterProductions = productions.filter(e => e.estateId == this.sharedService.estateId)
          this.getSales()

        });
    this.subscriptionService.add(getAllProduction);
  }

  getSales() {
    const getSales = this.reportService.getSales()
      .subscribe(
        Response => {
          const sales = Response
          this.filterSales = sales.filter(e => e.estateId == this.sharedService.estateId)
          this.getStock()
        }
      )
  }

  getStock() {
    const getRubberStock = this.reportService.getStocks()
      .subscribe(
        Response => {
          this.rubberStocks = Response.filter(e => e.estateId == this.sharedService.estateId)
          this.filterData();
        }
      )
    this.subscriptionService.add(getRubberStock);
  }

  filterData() {
    // Convert stocks array to a Set for faster lookup
    const stockMap = new Map(this.rubberStocks.map(stock => [stock.monthYear, stock]));

    // Find months where rubberDry < saleDry and (stock is 0 or not listed)
    this.filteredResults = this.filterProductions.filter(prod => {
      const sale = this.filterSales.find(s => s.saleMonth === prod.monthYear);
      const stock = stockMap.get(prod.monthYear);

      // Ensure sale exists and rubberDry < saleDry
      if (sale && prod.rubberDry < sale.saleDry) {
        // Check if stock is 0 or not listed
        if (!stock || (stock.currentStock == 0 && stock.previousStock == 0)) {
          return true;
        }
      }
      return false;
    });
    this.warningStock = this.filteredResults.length;
    this.updateBadge()
  }

  getProductionDrafted() {
    const previousMonth = new Date()
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const date = this.datePipe.transform(previousMonth, 'MMM-yyyy')
    const getProduction = this.productionService.getProduction()
      .subscribe(
        Response => {
          const production = Response.filter(x => x.estateId == this.sharedService.estateId && x.status == "DRAFT" && x.monthYear == date?.toUpperCase())
          if (production.length > 0) {
            this.warningProductionDrafted = true
            this.showEmptyMessage = false
            this.updateBadge()
          }
        }
      )
    this.subscriptionService.add(getProduction);
  }

  getGrantTitle() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const field = Response.filter(x => x.estateId == this.sharedService.estateId)
          field.forEach(field => {
            if (field.fieldGrants && field.fieldGrants.length == 0 || field.fieldGrants.some((g: any) => g.isActive === false)) {
              this.warningGrantTitle = true
              this.showEmptyMessage = false
              this.updateBadge()
            }
          })
        }
      )
  }

  updateBadge() {
    const badgeCount = (this.showAlertField ? 1 : 0) + (this.showAlertProduction ? 1 : 0) + (this.warningProductionDrafted ? 1 : 0) + (this.warningCostDrafted ? 1 : 0)
      + (this.warningGrantTitle ? 1 : 0) + this.warningStock + (this.warningContact ? 1: 0)
    this.badgeService.updateBadgeCount(badgeCount)
    if (badgeCount === 0) {
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

  getAdditionalContact() {
    const getContact = this.estateContactService.getEstateContact()
      .subscribe(
        Response => {
          const contacts = Response.filter(x => x.estateId == this.sharedService.estateId)
          let isEmpty = contacts.some(c =>
            c.position === null || c.position === '' ||
            c.phoneNo === null || c.phoneNo === '' ||
            c.email === null || c.email === ''
          );
          if (contacts.length == 0 || isEmpty == true) {
            this.warningContact = true
            this.updateBadge()
          }
        }
      )
    this.subscriptionService.add(getContact);
  }
}
