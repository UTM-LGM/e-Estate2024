import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Field } from 'src/app/_interface/field';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { FieldProductionDetailComponent } from 'src/app/field-production-detail/field-production-detail.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-field-production-monthly',
  templateUrl: './field-production-monthly.component.html',
  styleUrls: ['./field-production-monthly.component.css']
})
export class FieldProductionMonthlyComponent implements OnInit, OnDestroy {

  @Output() nextTabEvent = new EventEmitter<void>();
  @Input() selectedMonthYear = ''

  isLoading = true
  isSubmit = false
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
  productions: any[] = []


  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private fieldService: FieldService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private fieldProductionService: FieldProductionService,
    private dialog: MatDialog,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    // this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
    // this.getDate()
    // this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    this.date = this.selectedMonthYear
    this.getEstate()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonthYear']) {
      // Handle changes here if needed
      this.date = this.selectedMonthYear
      this.getEstate()
      this.getProducts(this.filterFields)
      this.products.forEach(y => y.monthYear = this.datePipe.transform(this.date, 'MMM-yyyy'))
    }
  }

  // getDate() {
  //   this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
  // }

  // monthSelected(month: string) {
  //   this.isSubmit = false
  //   this.getEstate()
  //   this.getProducts(this.filterFields)
  //   let monthDate = new Date(month)
  //   this.date = this.datePipe.transform(monthDate, 'MMM-yyyy')
  //   this.products.forEach(y => y.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy'))
  // }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response;
                this.getField()
              }
            )
          this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const filterFields = Response.filter(x => x.estateId == this.estate.id)
          this.filterFields = filterFields.filter(e => e.isMature === true && e.isActive === true && !e.fieldStatus?.toLowerCase().includes("conversion"))
          this.getProducts(this.filterFields)
          this.getAllProduction(this.filterFields)
        }
      )
    this.subscriptionService.add(getField);

  }

  getProducts(Fields: Field[]) {
    // this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
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
        product.status = "DRAFT"
      this.products.push(product)
      // this.isLoading = false
    });
  }

  initialZeroCuplump(index: any, i: number) {
    if (index == 0) {
      this.products[i].cuplumpDRC = 0
    }
    else if (index < 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of cuplump cannot below than 0',
      });
      this.products[i].cuplump = 0
      this.draftFilterProductions[i].cuplump = 0
    }
  }

  initialZeroLatex(index: any, i: number) {
    if (index == 0) {
      this.products[i].latexDRC = 0
    }
    else if (index < 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of latex cannot below than 0',
      });
      this.products[i].latex = 0
      this.draftFilterProductions[i].latex = 0
    }
  }

  initialZeroUSS(index: any, i: number) {
    if (index == 0) {
      this.products[i].ussDRC = 0
    }
    else if (index < 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of USS cannot below than 0',
      });
      this.products[i].uss = 0
      this.draftFilterProductions[i].uss = 0
    }
  }

  initialZeroOthers(index: any, i: number) {
    if (index == 0) {
      this.products[i].othersDRC = 0
    }
    else if (index < 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No of Others cannot below than 0',
      });
      this.products[i].others = 0
      this.draftFilterProductions[i].others = 0
    }
  }

  taskTap(index: any, totalTask: number, i: number) {
    if (this.draftFilterProductions.length == 0) {
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
    } else {
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
    this.spinnerService.requestStarted()
    const filteredProducts = this.products.filter(x => x !== null)
    if (filteredProducts.length === this.products.length) {
      this.fieldProductionService.addProduction(this.products)
        .subscribe(
          {
            next: (Response) => {
              this.spinnerService.requestEnded()
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
              this.spinnerService.requestEnded()
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
    // this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    const getProduction = this.fieldProductionService.getProduction()
      .subscribe(
        Response => {
          this.productions = Response
          this.filterProductions = this.productions.filter(e => e.monthYear == this.date.toUpperCase() && Fields.some(field => field.id === e.fieldId))
          this.draftFilterProductions = this.filterProductions.filter(e => e.status === "DRAFT")
          const fieldsWithoutProduction = Fields.filter(field =>
            !this.draftFilterProductions.some(prod => prod.fieldId === field.id)
          );
          if (this.draftFilterProductions.length != 0) {
            // Create a production entry for fields without any existing production data
            fieldsWithoutProduction.forEach(field => {
              let newDraft: any = {
                cuplump: 0,
                cuplumpDRC: 0,
                latex: 0,
                latexDRC: 0,
                noTaskTap: 0,
                noTaskUntap: 0,
                fieldId: field.id,
                fieldName: field.fieldName,  // Adding fieldName for display
                monthYear: this.date.toUpperCase(),
                status: "DRAFT",
                createdBy: this.sharedService.userId.toString(),
                createdDate: new Date()
              };
              this.draftFilterProductions.push(newDraft);
            });
          }
          this.submitFilterProductions = this.filterProductions.filter(e => e.status == "SUBMITTED")
          this.calculateCuplumpDry(this.filterProductions, this.cuplumpDry)
          this.calculateLatexDry(this.filterProductions, this.latexDry)
          this.calculateUSSDry(this.filterProductions, this.USSDry)
          this.calculateOthersDry(this.filterProductions, this.OthersDry)
          this.TotalCuplump()
          this.TotalLatex()
          this.TotalUSS()
          this.TotalOthers()
        });
    this.isLoading = false
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
      height: '276px',
      data: { data: product },
    });

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getEstate()
        });
  }

  submitProduction() {
    this.spinnerService.requestStarted();
  
    const updatedBy = this.sharedService.userId.toString();
    const date = new Date();
    
    // Filter the draft based on whether it already exists or is new
    const updates = this.draftFilterProductions
      .filter(prod => prod.id != null)
      .map(obj => ({
        ...obj,
        status: 'SUBMITTED', // Mark as submitted
        updatedBy: updatedBy,
        updatedDate: date
      }));
    
    const inserts = this.draftFilterProductions
      .filter(prod => prod.id == null)
      .map(obj => ({
        ...obj,
        status: 'SUBMITTED', // Mark as submitted
        updatedBy: updatedBy,
        updatedDate: date
      }));
  
    // Flag to disable the form submission
    this.isSubmit = true;
  
    // Handle updates if there are any
    if (updates.length > 0) {
      this.fieldProductionService.updateProductionDraft(updates).subscribe(
        response => {
          swal.fire({
            title: 'Done!',
            text: 'Updated existing Field Production information!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.getEstate(); // Refresh the data
        },
        error => {
          swal.fire({
            title: 'Error!',
            text: 'Failed to update the draft!',
            icon: 'error',
            showConfirmButton: true
          });
          this.isSubmit = false; // Re-enable the form submission
        }
      );
    }
  
    // Handle inserts if there are any
    if (inserts.length > 0) {
      this.fieldProductionService.addProduction(inserts).subscribe(
        response => {
          swal.fire({
            title: 'Done!',
            text: 'New Field Production information successfully submitted!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.getEstate(); // Refresh the data
        },
        error => {
          swal.fire({
            title: 'Error!',
            text: 'Failed to submit new Field Production!',
            icon: 'error',
            showConfirmButton: true
          });
          this.isSubmit = false; // Re-enable the form submission
        }
      );
    }
  
    // Ensure the spinner is stopped at the end
    this.spinnerService.requestEnded();
  }
  

  save() {
    this.spinnerService.requestStarted()

    const updates = this.draftFilterProductions.filter(prod => prod.id != null);
    const inserts = this.draftFilterProductions.filter(prod => prod.id == null);

    if (updates.length > 0) {
      this.fieldProductionService.updateProductionDraft(updates).subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Updated existing Field Production information!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.getEstate();
        },
        error => {
          swal.fire({
            text: 'Failed to update the draft',
            icon: 'error'
          });
        }
      );
    }

    if (inserts.length > 0) {
      this.fieldProductionService.addProduction(inserts).subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'New Field Production information successfully saved!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.getEstate();
        },
        error => {
          swal.fire({
            text: 'Failed to save new draft',
            icon: 'error'
          });
        }
      );
    }
    this.spinnerService.requestEnded();
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  validateCuplumpDRC(drc: any, i: any) {
    const drcValue = drc.target.value
    if ((drcValue >= 45 && drcValue <= 80) || drc === 0) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'CuplumpDRC must be between 45% to 80%',
        icon: 'error',
        showConfirmButton: true
      });
      this.products[i].cuplumpDRC = 0
    }
  }

  validateLatexDRC(drc: any, i: any) {
    const drcValue = drc.target.value
    if ((drcValue >= 20 && drcValue <= 55) || drc === 0) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'LatexDRC must be between 20% to 55%',
        icon: 'error',
        showConfirmButton: true
      });
      this.products[i].latexDRC = 0
    }

  }

}
