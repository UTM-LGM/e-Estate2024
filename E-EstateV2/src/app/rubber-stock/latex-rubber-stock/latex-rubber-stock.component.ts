import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Estate } from 'src/app/_interface/estate';
import { RubberStock } from 'src/app/_interface/rubberStock';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { RubberStockService } from 'src/app/_services/rubber-stock.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { RubberStockDetailComponent } from 'src/app/rubber-stock-detail/rubber-stock-detail.component';

@Component({
  selector: 'app-latex-rubber-stock',
  templateUrl: './latex-rubber-stock.component.html',
  styleUrls: ['./latex-rubber-stock.component.css']
})
export class LatexRubberStockComponent implements OnInit, OnDestroy {

  term = ''
  pageNumber = 1

  order = ''
  currentSortedColumn = ''
  rubberStocks: RubberStock[] = []
  estate: any = {} as any

  isLoading = true

  sortableColumns = [
    { columnName: 'monthYear', displayText: 'Month and Year' },
    { columnName: 'previousStock', displayText: 'Previous End Stock 100% DRC (Kg)' },
    { columnName: 'production', displayText: 'Total Production 100% DRC (Kg)' },
    { columnName: 'rubberSale', displayText: 'Total Rubber Sale 100% DRC (Kg)' },
    { columnName: 'endStock', displayText: 'Month End Stock 100% DRC (Kg)' },
    { columnName: 'weightLoss', displayText: 'Weight Loss (%)' },
  ];

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private rubberStockService: RubberStockService,
    private sharedService: SharedService,
  ){}

  ngOnInit(): void {
    this.getEstate()
    this.getStock()
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
              })
          this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }

  getStock() {
    setTimeout(() => {
      const getRubberStock = this.rubberStockService.getRubberStock()
        .subscribe(
          Response => {
            this.rubberStocks = Response.filter(e => e.estateId == this.sharedService.estateId && e.rubberType == 'LATEX')
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getRubberStock);

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

  openDialogEdit(stock: RubberStock, estate: Estate) {
    const dialogRef = this.dialog.open(RubberStockDetailComponent, {
      data: { stock: stock, estate: estate }
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        });
  }

  isLastMonth(monthYear: string): boolean {
    const previousMonth = new Date()
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const date = this.datePipe.transform(previousMonth, 'MMM-yyyy')
    return monthYear === date?.toUpperCase()
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

  
}
