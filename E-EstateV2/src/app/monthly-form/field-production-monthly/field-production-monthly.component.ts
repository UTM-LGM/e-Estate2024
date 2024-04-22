import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Field } from 'src/app/_interface/field';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { FieldProductionDetailComponent } from 'src/app/field-production-detail/field-production-detail.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-field-production-monthly',
  templateUrl: './field-production-monthly.component.html',
  styleUrls: ['./field-production-monthly.component.css']
})
export class FieldProductionMonthlyComponent implements OnInit {

  @Output() nextTabEvent = new EventEmitter<void>();
  isLoading = true
  date: any
  cuplump: any
  latex: any
  USS: any
  others: any
  total: any
  value: any

  previousMonth = new Date()

  estate: any = {} as any

  filterFields: Field[] = []

  products: FieldProduction[] = []

  filterProductions: FieldProduction[] = []
  draftFilterProductions: FieldProduction[] = []
  submitFilterProductions: FieldProduction[] = []

  totalCuplumpDry = 0
  totalLatexDry = 0
  totalUSSDry = 0
  totalOthersDry = 0

  totalCuplump: any[] = []
  totalLatex: any[] = []
  totalUSS: any[] = []
  totalOthers: any[] = []

  cuplumpDry: FieldProduction[] = []
  latexDry: FieldProduction[] = []
  totalDry: FieldProduction[] = []
  USSDry: FieldProduction[] = []
  OthersDry: FieldProduction[] = []


  constructor(
    private route: ActivatedRoute,
    private myLesenService:MyLesenIntegrationService,
    private fieldService:FieldService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private fieldProductionService: FieldProductionService,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.getEstate()
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          this.myLesenService.getOneEstate(routerParams['id'])
          .subscribe(
            Response =>{
              this.estate = Response;
              this.getField()
              this.isLoading = false
            }
          )}
      });
    }, 2000)
  }

  getField(){
    this.fieldService.getField()
    .subscribe(
      Response => {
        const filterFields = Response.filter(x=>x.estateId == this.estate.id)
        this.filterFields = filterFields.filter(e => e.isMature === true && e.isActive === true && !e.fieldStatus.toLowerCase().includes("conversion"))
        this.getProducts(this.filterFields)
        this.getAllProduction(this.filterFields)
      }
    )
  }

  getProducts(Fields: Field[]) {
    this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    this.products = []
    Fields.forEach(x => {
      let product = {} as FieldProduction;
      product.cuplump = 0,
        product.cuplumpDRC = 0,
        product.latex = 0,
        product.latexDRC = 0,
        product.uss = 0,
        product.ussDRC = 0,
        product.others = 0,
        product.noTaskTap = 0,
        product.noTaskUntap = 0,
        product.fieldId = x.id,
        product.monthYear = this.date,
        product.createdBy = this.sharedService.userId.toString(),
        product.createdDate = new Date(),
        product.status = "Draft"
        this.products.push(product)
    });
  }

  initialZeroCuplump(index:any, i:number){
    if(index == 0){
      this.products[i].cuplumpDRC = 0
    }
    else if(index < 0)
    {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of cuplump cannot below than 0',
      });
      this.products[i].cuplump = 0
      this.draftFilterProductions[i].cuplump =0
    }
  }

  initialZeroLatex(index:any, i:number){
    if(index == 0){
      this.products[i].latexDRC = 0
    }
    else if(index < 0)
    {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of latex cannot below than 0',
      });
      this.products[i].latex = 0
      this.draftFilterProductions[i].latex =0
    }
  }

  initialZeroUSS(index:any, i:number){
    if(index == 0){
      this.products[i].ussDRC = 0
    }
    else if(index < 0)
    {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of USS cannot below than 0',
      });
      this.products[i].uss = 0
      this.draftFilterProductions[i].uss =0
    }
  }

  initialZeroOthers(index:any, i:number){
    if(index == 0){
      this.products[i].othersDRC = 0
    }
    else if(index < 0)
    {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of Others cannot below than 0',
      });
      this.products[i].others = 0
      this.draftFilterProductions[i].others =0
    }
  }

  taskTap(index: any, totalTask: number, i: number) {
    if(this.draftFilterProductions.length == 0){
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
    }else{
      if (index > totalTask) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No of Task Tap is more than total task ! Total Task :' + totalTask,
        });
        this.draftFilterProductions[i].noTaskTap = 0
        this.draftFilterProductions[i].noTaskUntap = 0
      } else if (index < totalTask) {
        const untapTask = totalTask - index
        this.draftFilterProductions[i].noTaskUntap = untapTask;
      }
      else {
        this.draftFilterProductions[i].noTaskUntap = 0
      }
    }
    
  }

  nextTab() {
    this.nextTabEvent.emit();
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
                text: 'Field Production information successfully saved!',
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

  getAllProduction(Fields: Field[]) {
    this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          const productions = Response
          this.filterProductions = productions.filter(e => e.monthYear == this.date && Fields.some(field => field.id === e.fieldId))
          this.draftFilterProductions = this.filterProductions.filter(e=>e.status === "Draft")
          this.submitFilterProductions = this.filterProductions.filter(e => e.status == "Submitted")
          this.calculateCuplumpDry(this.filterProductions, this.cuplumpDry)
          this.calculateLatexDry(this.filterProductions, this.latexDry)
          this.calculateUSSDry(this.filterProductions, this.USSDry)
          this.calculateOthersDry(this.filterProductions, this.OthersDry)
          this.TotalCuplump()
          this.TotalLatex()
          this.TotalUSS()
          this.TotalOthers()
        });
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

  submitProduction(){
    const updatedBy = this.sharedService.userId.toString()
    const date = new Date()
    const updatedArray = this.draftFilterProductions.map(obj =>{
      return { ...obj, status: 'Submitted', updatedBy: updatedBy, updatedDate: date }
    });
    this.fieldProductionService.updateProductionDraft(updatedArray)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'Field Production information successfully submitted!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
      });this.getEstate()}
    )
  }

  save(){
    this.fieldProductionService.updateProductionDraft(this.draftFilterProductions)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'Field Production information successfully saved!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.getEstate()
      }
    )
  }

}
