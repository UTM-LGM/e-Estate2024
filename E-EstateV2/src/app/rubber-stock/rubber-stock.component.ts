import { Component, OnInit } from '@angular/core';
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
import { RubberSaleDetailComponent } from '../rubber-sale-detail/rubber-sale-detail.component';
import { RubberStockDetailComponent } from '../rubber-stock-detail/rubber-stock-detail.component';


@Component({
  selector: 'app-rubber-stock',
  templateUrl: './rubber-stock.component.html',
  styleUrls: ['./rubber-stock.component.css']
})
export class RubberStockComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private myLesenService:MyLesenIntegrationService,
    private dialog: MatDialog,
    private rubberStockService:RubberStockService,
    private sharedService:SharedService,
    private datePipe: DatePipe,
  ){
    this.previousDate.setMonth(this.previousDate.getMonth() - 1)
  }

  isLoading = true
  estate: any = {} as any

  term = ''
  pageNumber = 1

  order = ''
  currentSortedColumn = ''

  rubberStocks:RubberStock[]=[]

  date: any
  previousDate = new Date()


  sortableColumns = [
    { columnName: 'monthYear', displayText: 'Month and Year' },
    { columnName: 'previousStock', displayText: 'Previous End Stock 100% Dry (Kg)'},
    { columnName: 'production', displayText: 'Total Production 100% Dry (Kg)' },
    { columnName: 'rubberSale', displayText: 'Total Rubber Sale 100% Dry (Kg)' },
    { columnName: 'endStock', displayText: 'Month End Stock 100% Dry (Kg)' },
    { columnName: 'waterLoss', displayText: 'Water Loss (%)' },
  ];

  ngOnInit(): void {
    this.getEstate()
    this.getStock()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          this.myLesenService.getOneEstate(routerParams['id'])
          .subscribe(
            Response =>{
              this.estate = Response
              this.isLoading = false
            })
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

  openDialog(estate:Estate,stock:RubberStock[]){
    this.date = this.datePipe.transform(this.previousDate, 'MMM-yyyy')?.toUpperCase()
    const date = this.rubberStocks.filter(x=>x.monthYear == this.date && x.isActive == true)
    if(date.length === 0)
    {
      const dialog = this.dialog.open(AddRubberStockComponent, {
      data: {estate:estate, stock:stock}
      });
      dialog.afterClosed()
        .subscribe(
          Response => {
            this.ngOnInit()
          });
    }
    else{
      swal.fire({
        text: 'Month already exists!',
        icon: 'error'
      });
    }
    
  }

  getStock(){
    setTimeout(() => {
      this.rubberStockService.getRubberStock()
      .subscribe(
        Response =>{
          this.rubberStocks = Response.filter(e=>e.estateId == this.sharedService.estateId)
          this.isLoading =false
        }
      )
    }, 2000)
  }

  status(stock:RubberStock){
    stock.updatedBy = this.sharedService.userId
    stock.updatedDate = new Date()
    stock.isActive = !stock.isActive
    this.rubberStockService.updateRubberStock(stock)
    .subscribe(
      Response =>{
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

  openDialogEdit(stock:RubberStock, estate:Estate){
    const dialogRef =this.dialog.open(RubberStockDetailComponent, {
      data: { stock: stock, estate: estate}
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        });
  }

}
