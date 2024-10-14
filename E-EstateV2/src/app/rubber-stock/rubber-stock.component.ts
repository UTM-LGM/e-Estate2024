import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { Estate } from '../_interface/estate';
import { MatDialog } from '@angular/material/dialog';
import { AddRubberStockComponent } from '../add-rubber-stock/add-rubber-stock.component';
import { RubberStockService } from '../_services/rubber-stock.service';
import { RubberStock } from '../_interface/rubberStock';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { RubberStockDetailComponent } from '../rubber-stock-detail/rubber-stock-detail.component';
import { SubscriptionService } from '../_services/subscription.service';
import { CuplumpRubberStockComponent } from './cuplump-rubber-stock/cuplump-rubber-stock.component';
import { LatexRubberStockComponent } from './latex-rubber-stock/latex-rubber-stock.component';

@Component({
  selector: 'app-rubber-stock',
  templateUrl: './rubber-stock.component.html',
  styleUrls: ['./rubber-stock.component.css']
})
export class RubberStockComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private dialog: MatDialog,
    private rubberStockService: RubberStockService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private subscriptionService:SubscriptionService
  ) {
    this.previousDate.setMonth(this.previousDate.getMonth() - 1)
  }

  isLoading = true

  term = ''
  pageNumber = 1

  order = ''
  currentSortedColumn = ''

  rubberStocks: RubberStock[] = []

  date: any
  previousDate = new Date()
  estate: any = {} as any

  @ViewChild('cuplumpStock') cuplumpStock: CuplumpRubberStockComponent | undefined;
  @ViewChild('latexStock') latexStock: LatexRubberStockComponent | undefined;

  ngOnInit(): void {
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
              })
          this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }


  openDialog(estate: Estate, stock: RubberStock[]) {
    const dialog = this.dialog.open(AddRubberStockComponent, {
      data: { estate: estate, stock: stock }})
      dialog.afterClosed()
          .subscribe(
            Response => {
              this.ngOnInit()
              this.refreshTables();
            });
          }

  getStock() {
    setTimeout(() => {
      const getRubberStock = this.rubberStockService.getRubberStock()
        .subscribe(
          Response => {
            this.rubberStocks = Response.filter(e => e.estateId == this.sharedService.estateId)
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getRubberStock);

    }, 2000)
  }

  status(stock: RubberStock) {
    stock.updatedBy = this.sharedService.userId
    stock.updatedDate = new Date()
    stock.isActive = !stock.isActive
    this.rubberStockService.updateRubberStock(stock)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Rubber Stock Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      )
  }

  refreshTables() {
    if (this.cuplumpStock) {
      this.cuplumpStock.getStock();
    }
    if (this.latexStock) {
      this.latexStock.getStock();
    }
  }


  

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
