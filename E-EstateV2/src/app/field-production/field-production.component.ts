import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Field } from '../_interface/field';
import { FieldProduction } from '../_interface/fieldProduction';
import { FieldProductionService } from '../_services/field-production.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FieldProductionDetailComponent } from '../field-production-detail/field-production-detail.component';
import { SharedService } from '../_services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { FieldService } from '../_services/field.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';


@Component({
  selector: 'app-field-production',
  templateUrl: './field-production.component.html',
  styleUrls: ['./field-production.component.css'],
})
export class FieldProductionComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: ElementRef | undefined
  previousMonth = new Date()
  currentDate = new Date()
  today = new Date()

  estate: any = {} as any

  fields: Field[] = []
  filterFields: Field[] = []
  totalTask: Field[] = []

  products: FieldProduction[] = []
  filterProductions: FieldProduction[] = []
  cuplumpDry: FieldProduction[] = []
  latexDry: FieldProduction[] = []
  totalDry: FieldProduction[] = []
  USSDry: FieldProduction[] = []
  OthersDry: FieldProduction[] = []


  totalCuplump: any[] = []
  totalLatex: any[] = []
  totalUSS: any[] = []
  totalOthers: any[] = []

  isLoading = true
  totalCuplumpDry = 0
  totalLatexDry = 0
  totalUSSDry = 0
  totalOthersDry = 0

  date: any
  cuplump: any
  latex: any
  USS: any
  others: any
  total: any
  value: any

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private fieldProductionService: FieldProductionService,
    private fieldService: FieldService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.getDate()
    this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    this.getEstate()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response;
                this.getField()
                this.getProducts(this.filterFields)
                this.getAllProduction(this.filterFields)
                this.isLoading = false
              }
            )
        this.subscriptionService.add(getOneEstate);

        }
      });
    }, 2000)
  }

  getField() {
    const getField = this.fieldService.getFieldByEstateId(this.estate.id)
      .subscribe(
        Response => {
          const filterFields = Response
          this.filterFields = filterFields.filter(e => e.isMature === true && e.isActive === true && !e.fieldStatus?.toLowerCase().includes("conversion"))
          this.getProducts(this.filterFields)
          this.getAllProduction(this.filterFields)
        }
      )
      this.subscriptionService.add(getField);

  }

  taskTap(index: any, totalTask: number, i: number) {
    if (index > totalTask) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of Task Tap is more than total task ! Total Task :' + totalTask,
      });
      this.products[i].noTaskTap = 0
      this.products[i].noTaskUntap = 0
    } else if (index < totalTask) {
      const untapTask = totalTask - index
      this.products[i].noTaskUntap = untapTask;
    }
    else {
      this.products[i].noTaskUntap = 0
    }
  }

  monthSelected(month: string) {
    this.getEstate()
    this.getProducts(this.filterFields)
    let monthDate = new Date(month)
    this.date = this.datePipe.transform(monthDate, 'MMM-yyyy')
    this.products.forEach(y => y.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy'))
  }

  getDate() {
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
  }

  add() {
    const filteredProducts = this.products.filter(x => x !== null)
    if (filteredProducts.length === this.products.length) {
      this.fieldProductionService.addProduction(this.products)
        .subscribe(
          {
            next: (Response) => {
              swal.fire({
                title: 'Done!',
                text: 'Field Production information successfully submitted!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
              this.getEstate()
            },
            error: (err) => {
              swal.fire({
                text: 'Please fil up the form',
                icon: 'error'
              });
            }
          }
        );
    } else { }
  }

  getProducts(Fields: Field[]) {
    this.products = []
    Fields.forEach(x => {
      let product = {} as FieldProduction;
      product.cuplump = null,
        product.cuplumpDRC = null,
        product.latex = null,
        product.latexDRC = null,
        product.uss = null,
        product.ussDRC = null,
        product.others = null,
        product.noTaskTap = null,
        product.noTaskUntap = null,
        product.fieldId = x.id,
        product.monthYear = this.date,
        product.createdBy = this.sharedService.userId.toString(),
        product.createdDate = new Date(),
        this.products.push(product)
    });
  }

  getAllProduction(Fields: Field[]) {
    const getProduction = this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          const productions = Response
          this.filterProductions = productions.filter(e => e.monthYear == this.date.toUpperCase() && Fields.some(field => field.id === e.fieldId))
          this.calculateCuplumpDry(this.filterProductions, this.cuplumpDry)
          this.calculateLatexDry(this.filterProductions, this.latexDry)
          this.calculateUSSDry(this.filterProductions, this.USSDry)
          this.calculateOthersDry(this.filterProductions, this.OthersDry)
          this.TotalCuplump()
          this.TotalLatex()
          this.TotalUSS()
          this.TotalOthers()
        });
      this.subscriptionService.add(getProduction);

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

  openDialog(product: FieldProduction): void {
    const dialogRef = this.dialog.open(FieldProductionDetailComponent, {
      height: '340px',
      data: { data: product },
    });

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getEstate()
        });
  }

  isUpdateDisabled(): boolean {
    const selectedDate = new Date(this.date)
    if (
      //condition to check other month not same as current and previous
      !((selectedDate.getFullYear() === this.currentDate.getFullYear() && selectedDate.getMonth() === this.currentDate.getMonth()) ||
        (selectedDate.getFullYear() === this.currentDate.getFullYear() && selectedDate.getMonth() === this.currentDate.getMonth() - 1)) ||
      //to check if previous month more than 15th
      (this.currentDate.getDate() <= 15)
    ) {
      return true;
    }
    return false
  }

  futureMonth(): boolean {
    const selectedMonth = new Date(this.date);
    if (selectedMonth.getFullYear() < this.currentDate.getFullYear() ||
      (selectedMonth.getFullYear() === this.currentDate.getFullYear() &&
        selectedMonth.getMonth() < this.currentDate.getMonth())) {
      return true;
    } else {
      return false;
    }
  }

  initialZeroCuplump(index: any, i: number) {
    if (index == 0) {
      this.products[i].cuplumpDRC = 0
    }
  }

  initialZeroLatex(index: any, i: number) {
    if (index == 0) {
      this.products[i].latexDRC = 0
    }
  }

  initialZeroUSS(index: any, i: number) {
    if (index == 0) {
      this.products[i].ussDRC = 0
    }
  }

  initialZeroOthers(index: any, i: number) {
    if (index == 0) {
      this.products[i].othersDRC = 0
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
