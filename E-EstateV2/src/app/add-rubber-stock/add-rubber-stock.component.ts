import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RubberStockComponent } from '../rubber-stock/rubber-stock.component';
import { FieldService } from '../_services/field.service';
import { Field } from '../_interface/field';
import { FieldProductionService } from '../_services/field-production.service';
import { FieldProduction } from '../_interface/fieldProduction';
import { DatePipe } from '@angular/common';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { RubberSale } from '../_interface/rubberSale';
import { SharedService } from '../_services/shared.service';
import { RubberStock } from '../_interface/rubberStock';
import { RubberStockService } from '../_services/rubber-stock.service';
import swal from 'sweetalert2';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-add-rubber-stock',
  templateUrl: './add-rubber-stock.component.html',
  styleUrls: ['./add-rubber-stock.component.css']
})
export class AddRubberStockComponent implements OnInit, OnDestroy {

  estate: any = {} as any
  filterProductions: FieldProduction[] = []
  filterFields: Field[] = []
  date: any
  previousDate: any
  cuplumpDry: FieldProduction[] = []
  latexDry: FieldProduction[] = []
  totalDry: FieldProduction[] = []
  USSDry: FieldProduction[] = []
  OthersDry: FieldProduction[] = []
  stock = {} as RubberStock

  cuplump: any
  latex: any
  USS: any
  others: any
  total: any
  value: any

  totalCuplumpDry = 0
  totalLatexDry = 0
  totalUSSDry = 0
  totalOthersDry = 0
  totalSaleDry = 0


  totalCuplump: any[] = []
  totalLatex: any[] = []
  totalUSS: any[] = []
  totalOthers: any[] = []
  totalSales: any[] = []


  monthYear = new Date()
  previousMonth = new Date()
  today = new Date()
  isDecember: boolean | undefined
  totalProduction = 0
  filterSales: RubberSale[] = []

  rubberStocks: RubberStock[] = []
  allRubberStock: RubberStock[] = []

  isLoadingProduction = true
  isLoadingSale = true

  isPreviousStock = false

  constructor(
    public dialogRef: MatDialogRef<RubberStockComponent>,
    private fieldService: FieldService,
    private fieldProductionService: FieldProductionService,
    private datePipe: DatePipe,
    private rubberSaleService: RubberSaleService,
    private sharedService: SharedService,
    private rubberStockService: RubberStockService,
    private subscriptionService:SubscriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.estate = data.estate;
    if (this.data.stock.id != undefined) {
      this.stock = data.stock
    }
  }

  ngOnInit(): void {
    this.getDate()
    this.date = this.datePipe.transform(this.monthYear, 'MMM-yyyy')
    this.previousDate = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')?.toUpperCase()
  }

  chooseRubberType(){
    this.stock.previousStock = 0
    this.stock.currentStock = 0
    this.stock.weightLoss = 0
    this.getAllProduction()
    this.getSales()
    this.getStock()
  }

  getStock() {
    const getStock = this.rubberStockService.getRubberStock()
      .subscribe(
        Response => {
          this.allRubberStock = Response
          this.rubberStocks = Response.filter(e => e.estateId == this.sharedService.estateId && e.monthYear == this.previousDate && e.isActive == true && e.rubberType == this.stock.rubberType)
          if (this.rubberStocks.length != 0) {
            let latestItem = this.rubberStocks[this.rubberStocks.length - 1];
            this.stock.previousStock = latestItem.currentStock;
            this.isPreviousStock = true
          }
        }
      )
    this.subscriptionService.add(getStock);
  }

  getDate() {
    this.monthYear.setMonth(this.monthYear.getMonth() - 1)
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 2)
  }

  back() {
    this.dialogRef.close()
  }

  monthSelected(month: string) {
    this.stock.rubberType = ''
    this.isLoadingProduction = true
    this.isLoadingSale = true

    let monthDate = new Date(month)
    this.date = this.datePipe.transform(monthDate, 'MMM-yyyy')

    monthDate.setMonth(monthDate.getMonth() - 1);
    this.previousDate = this.datePipe.transform(monthDate, 'MMM-yyyy')?.toUpperCase();
  }

  addStock() {
    const existingMonth = this.allRubberStock.filter(e=>e.monthYear == this.date.toUpperCase() && e.rubberType == this.stock.rubberType && e.estateId == this.sharedService.estateId)
    if(existingMonth.length != 0 ){
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Month already exist',
      });
    }else{
      this.stock.estateId = this.estate.id
      this.stock.monthYear = this.date
      this.stock.createdBy = this.sharedService.userId
      this.stock.isActive = true
      this.stock.weightLoss = parseFloat(this.stock.weightLoss.toFixed(2))
      if(this.stock.rubberType == 'CUPLUMP'){
        this.stock.totalProduction = this.totalCuplumpDry
      }
      else if(this.stock.rubberType == 'LATEX'){
        this.stock.totalProduction = this.totalLatexDry
      }
      this.rubberStockService.addRubberStock(this.stock)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Stock successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialogRef.close()
          }
        )
    }
    // 
  }

  getAllProduction() {
    const getAllProduction = this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          const productions = Response

          this.filterProductions = productions.filter(e =>e.status == "SUBMITTED" && e.estateId == this.sharedService.estateId && e.monthYear == this.date.toUpperCase())
          if(this.stock.rubberType == 'CUPLUMP'){
            this.TotalCuplump()
          }
          else if(this.stock.rubberType == 'LATEX'){
            this.TotalLatex()
          }
          // this.calculateTotal()
          this.isLoadingProduction = false
        });
    this.subscriptionService.add(getAllProduction);
  }

  TotalCuplump() {
    this.totalCuplump = this.filterProductions.map((item: any) => {
      const cuplumpDry = item.cuplump * (item.cuplumpDRC / 100)
      return { cuplumpDry }
    });
    this.totalCuplumpDry = this.totalCuplump.reduce((total, item) => total + item.cuplumpDry, 0)
  }

  TotalLatex() {
    this.totalLatex = this.filterProductions.map((item: any) => {
      const latexDry = item.latex * (item.latexDRC / 100)
      return { latexDry }
    });
    this.totalLatexDry = this.totalLatex.reduce((total, item) => total + item.latexDry, 0)
  }


  calculateTotal() {
    this.stock.totalProduction = this.totalCuplumpDry + this.totalLatexDry + this.totalUSSDry + this.totalOthersDry
  }

  calculateWaterDepletion() {
    if(this.stock.rubberType == 'CUPLUMP'){
      const production = this.totalCuplumpDry + this.stock.previousStock
      const stock = this.stock.totalSale + this.stock.currentStock
      this.stock.weightLoss = ((production - stock) / production) * 100 
    }else if(this.stock.rubberType == 'LATEX'){
      const production = this.totalLatexDry + this.stock.previousStock
      const stock = this.stock.totalSale + this.stock.currentStock
      this.stock.weightLoss = ((production - stock) / production) * 100
    }
    if(this.stock.weightLoss <= 0){
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Weight Loss cannot below than 0',
      });
      this.stock.weightLoss = 0
      this.stock.currentStock = 0
    }
    else if(this.stock.weightLoss >= 15){
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Weight Loss cannot higher than 15%',
      });
      this.stock.weightLoss = 0
      this.stock.currentStock = 0
    }
  }

  getSales() {
    const getSale = this.rubberSaleService.getSale()
      .subscribe(
        Response => {
          const rubberSales = Response

          const date = new Date(this.date)
          this.filterSales = rubberSales.filter(sale => {
            const saleDate = new Date(sale.saleDateTime);
            return saleDate.getFullYear() == date.getFullYear() && (saleDate.getMonth() + 1) == (date.getMonth() +1) && sale.estateId == this.sharedService.estateId && sale.rubberType == this.stock.rubberType && sale.isActive ==true;
          });

          this.calculateSale()
          this.isLoadingSale = false
        })
    this.subscriptionService.add(getSale);
  }

  calculateSale() {
    this.totalSales = this.filterSales.map((item: any) => {
      const rubberDry = (item.wetWeight * item.drc / 100)
      return { rubberDry }
    });
    this.stock.totalSale = this.totalSales.reduce((total, item) => total + item.rubberDry, 0)
  }

  update() {
    this.stock.updatedBy = this.sharedService.userId
    this.rubberStockService.updateRubberStock(this.stock)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Stock successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}