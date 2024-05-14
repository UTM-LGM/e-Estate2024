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
    this.getField()
    this.getSales()
    this.getStock()
  }

  getStock() {
    const getStock = this.rubberStockService.getRubberStock()
      .subscribe(
        Response => {
          this.rubberStocks = Response.filter(e => e.estateId == this.sharedService.estateId && e.monthYear == this.previousDate && e.isActive == true)
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

  addStock() {
    this.date = this.datePipe.transform(this.monthYear, 'MMM-yyyy')
    this.stock.estateId = this.estate.id
    this.stock.monthYear = this.date
    this.stock.createdBy = this.sharedService.userId
    this.stock.isActive = true
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

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const filterFields = Response.filter(x => x.estateId == this.estate.id)
          this.filterFields = filterFields.filter(e => e.isMature === true && e.isActive === true && !e.fieldStatus.toLowerCase().includes("conversion"))
          this.getAllProduction(this.filterFields)
        }
      )
    this.subscriptionService.add(getField);
  }

  getAllProduction(Fields: Field[]) {
    const getAllProduction = this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          const productions = Response
          this.filterProductions = productions.filter(e => e.monthYear?.includes(this.date) && Fields.some(field => field.id === e.fieldId) && e.status == "Submitted")
          this.calculateCuplumpDry(this.filterProductions, this.cuplumpDry)
          this.calculateLatexDry(this.filterProductions, this.latexDry)
          this.calculateUSSDry(this.filterProductions, this.USSDry)
          this.calculateOthersDry(this.filterProductions, this.OthersDry)
          this.TotalCuplump()
          this.TotalLatex()
          this.TotalUSS()
          this.TotalOthers()
          if (this.stock.totalProduction == null) {
            this.calculateTotal()
          }
          this.isLoadingProduction = false
        });
    this.subscriptionService.add(getAllProduction);
  }

  calculateCuplumpDry(data: FieldProduction[], cuplump: FieldProduction[]) {
    this.value = data
    this.cuplump = cuplump
    for (let j = 0; j < data.length; j++) {
      this.cuplump[j] = this.value[j].cuplump * (this.value[j].cuplumpDRC / 100)
    }
  }

  calculateLatexDry(data: FieldProduction[], latex: FieldProduction[]) {
    this.value = data
    this.latex = latex
    for (let j = 0; j < data.length; j++) {
      this.latex[j] = this.value[j].latex * (this.value[j].latexDRC / 100)
    }
  }

  calculateUSSDry(data: FieldProduction[], USS: FieldProduction[]) {
    this.value = data
    this.USS = USS
    for (let j = 0; j < data.length; j++) {
      this.USS[j] = this.value[j].uss * (this.value[j].ussDRC / 100)
    }
  }

  calculateOthersDry(data: FieldProduction[], others: FieldProduction[]) {
    this.value = data
    this.others = others
    for (let j = 0; j < data.length; j++) {
      this.others[j] = this.value[j].others * (this.value[j].othersDRC / 100)
    }
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

  TotalUSS() {
    this.totalUSS = this.filterProductions.map((item: any) => {
      const USSDry = item.uss * (item.ussDRC / 100)
      return { USSDry }
    })
    this.totalUSSDry = this.totalUSS.reduce((total, item) => total + item.USSDry, 0)
  }

  TotalOthers() {
    this.totalOthers = this.filterProductions.map((item: any) => {
      const OthersDry = item.others * (item.othersDRC / 100)
      return { OthersDry }
    })
    this.totalOthersDry = this.totalOthers.reduce((total, item) => total + item.OthersDry, 0)
  }

  calculateTotal() {
    this.stock.totalProduction = this.totalCuplumpDry + this.totalLatexDry + this.totalUSSDry + this.totalOthersDry
  }

  calculateWaterDepletion() {
    const production = this.stock.totalProduction + this.stock.previousStock
    const stock = this.stock.totalSale + this.stock.currentStock
    this.stock.waterLoss = ((production - stock) / production) * 100
  }

  getSales() {
    const getSale = this.rubberSaleService.getSale()
      .subscribe(
        Response => {
          const rubberSales = Response
          this.filterSales = rubberSales.filter(e => {
            const saleDate = new Date(e.saleDateTime);
            return e.estateId == this.sharedService.estateId && saleDate.getMonth() + 1 == this.monthYear.getMonth() + 1 && saleDate.getFullYear() == this.monthYear.getFullYear();
          })
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