import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { RubberStockService } from '../_services/rubber-stock.service';
import { RubberStock } from '../_interface/rubberStock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { RubberStockComponent } from '../rubber-stock/rubber-stock.component';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { RubberSale } from '../_interface/rubberSale';
import { SubscriptionService } from '../_services/subscription.service';
import { FieldProductionService } from '../_services/field-production.service';
import { FieldProduction } from '../_interface/fieldProduction';
import { SpinnerService } from '../_services/spinner.service';

@Component({
  selector: 'app-rubber-stock-detail',
  templateUrl: './rubber-stock-detail.component.html',
  styleUrls: ['./rubber-stock-detail.component.css']
})
export class RubberStockDetailComponent implements OnInit {

  estate: any = {} as any

  rubberStocks: RubberStock[] = []
  stock = {} as RubberStock

  isLoadingProduction = true
  isLoadingSale = true

  isPreviousStock = false

  filterSales: RubberSale[] = []

  totalSales: any[] = []
  filterProductions: FieldProduction[] = []

  cuplump: any
  latex: any
  USS: any
  others: any
  total: any
  value: any

  totalCuplumpDry = 0
  totalLatexDry = 0

  totalCuplump: any[] = []
  totalLatex: any[] = []



  constructor(
    private rubberStockService: RubberStockService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<RubberStockComponent>,
    private rubberSaleService: RubberSaleService,
    private subscriptionService:SubscriptionService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService:SpinnerService,
    private fieldProductionService: FieldProductionService,
  ) {
    this.estate = data.estate;
    if (this.data.stock.id != undefined) {
      this.isLoadingProduction = false
      this.isLoadingSale = false
      this.stock = data.stock
    }
  }

  ngOnInit(): void {
    this.getSales()
    this.getAllProduction()
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

  getAllProduction() {
    const getAllProduction = this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          const productions = Response

          this.filterProductions = productions.filter(e =>e.status == "SUBMITTED" && e.estateId == this.sharedService.estateId && e.monthYear?.toUpperCase() == this.stock.monthYear)

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

  update() {
    this.stock.updatedBy = this.sharedService.userId
    if(this.stock.rubberType == 'CUPLUMP'){
      this.stock.totalProduction = this.totalCuplumpDry
    }
    else if(this.stock.rubberType == 'LATEX'){
      this.stock.totalProduction = this.totalLatexDry
    }
    this.spinnerService.requestStarted()
    this.rubberStockService.updateRubberStock(this.stock)
      .subscribe(
        Response => {
          this.spinnerService.requestEnded()
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

  getSales() {
    const getSale = this.rubberSaleService.getSale()
      .subscribe(
        Response => {
          const rubberSales = Response
          const date = new Date(this.stock.monthYear)
          this.filterSales = rubberSales.filter(sale => {
            const saleDate = new Date(sale.saleDateTime);

            return saleDate.getFullYear() == date.getFullYear() && (saleDate.getMonth() + 1) == (date.getMonth() +1) && sale.estateId == this.sharedService.estateId && sale.rubberType == this.stock.rubberType && sale.isActive == true;
          });
          this.calculateSale()
          this.calculateWaterDepletion()
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
    this.changeDetectorRef.detectChanges();
  }


  back() {
    this.dialogRef.close()
  }
}
