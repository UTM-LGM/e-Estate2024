import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { LocalLabor } from 'src/app/_interface/localLabor';
import { CostAmountService } from 'src/app/_services/cost-amount.service';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-home-estate-clerk',
  templateUrl: './home-estate-clerk.component.html',
  styleUrls: ['./home-estate-clerk.component.css']
})
export class HomeEstateClerkComponent implements OnInit {

  productions: FieldProduction[] = []
  filterProductions: FieldProduction[] = []
  productionYearly: FieldProduction[] = []

  filterLocalLabors: LocalLabor[] = []

  sumCuplumpByMonthYear: any
  chartEstate: any

  estate: any = {} as any

  productivity: any[] = []
  workerShortages: any[] = []

  yearNow = 0
  totalCuplump = 0
  totalLatex = 0
  totalLocal = 0
  totalForeign = 0
  estateId = 0

  currentTotalTapper = 0
  currentTotalField = 0
  tapperShortage = 0
  fieldShortage =0

  productivityCuplumpDry = 0
  productivityLatexDry = 0
  productivityUSSDry = 0
  productivityOthersDry = 0

  matureArea = 0
  immatureArea = 0
  tappedArea = 0

  isLoadingEstateName = true
  isLoadingProduction = true
  isLoadingLocal = true
  isLoadingForeign = true
  showAlert = false

  isLoadingTapper = true
  isLoadingField = true
  isLoadingMatureArea = true
  isLoadingImmatureArea = true
  isLoadingTappedArea = true
  isLoadingTapperShortage = true
  isLoadingFieldShortage = true

  warningProductionDrafted = false
  warningCostDrafted = false

  productivityByYear:any


  constructor(
    private reportService: ReportService,
    private myLesenService: MyLesenIntegrationService,
    private sharedService: SharedService,
    private productionService:FieldProductionService,
    private datePipe: DatePipe,
    private costInformationService:CostAmountService,
    private fieldService:FieldService
  ) { }

  ngOnInit() {
    if (this.sharedService.role != "Admin") {
      this.yearNow = new Date().getFullYear()
      this.estateId = this.sharedService.estateId
      this.checkDate()
      this.getEstate()
      this.getProductionReport()
      this.getWorker()
      this.getFieldArea()
      this.getProduction()
      this.getCost()
      this.getWorkerShortage()
      this.getField()
    }
  }

  ngAfterViewInit() {
    this.getProductivity()
  }

  getField(){
    this.reportService.getCurrentField(this.yearNow.toString())
    .subscribe(
      Response =>{
        const field = Response.filter(x=>x.estateId == this.sharedService.estateId && x.fieldStatus.toLowerCase().includes('tapped area'))
        this.tappedArea = field.reduce((sum, field) => sum + field.area, 0)
        this.isLoadingTappedArea = false
      }
    )
  }

  getProduction(){
    const previousMonth = new Date()
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const date = this.datePipe.transform(previousMonth, 'MMM-yyyy')
    this.productionService.getProduction()
    .subscribe(
      Response =>{
        const production = Response.filter(x=>x.estateId == this.sharedService.estateId && x.status == "Draft" && x.monthYear == date)
        if(production.length > 0)
          {
            this.warningProductionDrafted = true
          }
      }
    )
  }

  getWorkerShortage() {
    this.reportService.getWorkerShortageEstate().subscribe(
      response => {
        this.workerShortages = response.filter(x=>x.estateId == this.sharedService.estateId);
        if(this.workerShortages.length === 0)
          {
            this.tapperShortage = 0
            this.fieldShortage = 0
            this.isLoadingTapperShortage = false
            this.isLoadingFieldShortage = false
          }
          else{
            this.tapperShortage = this.workerShortages.reduce((sum, workerShortage) => sum + workerShortage.tapperShortage, 0)
            this.isLoadingTapperShortage = false
            this.fieldShortage = this.workerShortages.reduce((sum, workerShortage) => sum + workerShortage.fieldShortage, 0)
            this.isLoadingFieldShortage = false
          }
      }
    );
  }

  getCost(){
    this.costInformationService.getCostAmount()
    .subscribe(
      Response =>{
        const cost = Response.filter(x=>x.estateId == this.estateId && x.status == "Draft" && x.year == new Date().getFullYear())
        if(cost.length > 0){
          this.warningCostDrafted = true
        }
      }
    )
  }

  checkDate() {
    const today = new Date()
    const isNovember = today.getMonth() === 10 // Note: JavaScript months are 0-based
    if (isNovember) {
      this.showAlert = true
    }
  }

  getEstate() {
    this.myLesenService.getOneEstate(this.estateId)
      .subscribe(
        Response => {
          this.estate = Response
          this.isLoadingEstateName = false
        }
      )
  }

  getProductionReport() {
    this.reportService.getCurrentCropProduction()
      .subscribe(
        Response => {
          const productions = Response
          this.filterProductions = productions.filter(x => x.estateId == this.estateId)
          if (this.filterProductions.length === 0) {
            const product: any = {
              cuplumpDry: 0,
              latexDry: 0,
              ussDry: 0,
              othersDry: 0,
            };
            this.filterProductions.push(product)
          }
          this.isLoadingProduction = false
        }
      )

  }

  getWorker() {
    this.reportService.getCurrentTapperAndFieldWorker()
      .subscribe(
        Response => {
          const worker = Response.filter(x => x.estateId == this.sharedService.estateId)
          if(worker.length === 0){
            this.currentTotalTapper = 0
            this.currentTotalField = 0
            this.isLoadingTapper = false
            this.isLoadingField = false
          }
          else{
            worker.forEach(item => {
              // Add values with "tapper" in their keys to currentTotalTapper
              this.currentTotalTapper += item.tapperCheckrole + item.tapperContractor;
              this.isLoadingTapper = false
  
              // Add values with "field" in their keys to currentTotalField
              this.currentTotalField += item.fieldCheckrole + item.fieldContractor;
              this.isLoadingField = false
            });
          }  
        }
      )
  }

  getProductivity() {
    this.reportService.getCropProductivity()
      .subscribe(
        {
          next:(Response)=>{
            this.productivity = Response.filter(x=>x.estateId == this.sharedService.estateId);
            if (this.productivity.length === 0) {
              const product: any = {
                productivityCuplumpDry: 0,
                productivityLatexDry: 0,
                productivityUSSDry: 0,
                productivityOthersDry: 0,
              };
              this.productivity.push(product);
            } else {
              // Call the groupByYear function to group data by year and calculate sums
              this.productivityByYear = this.groupByYear(this.productivity);
              this.createProductivityChart(); // Call chart creation after data is processed
            }
            this.isLoadingProduction = false;
          },
          error:(err)=>{
            console.error('Error fetching productivity data:', err);
            this.isLoadingProduction = false;
          }
        }
      );
  }

  // Helper function to group data by year and calculate sums
  groupByYear(data:any) {
    return data.reduce((acc:any, curr:any) => {
      const year = curr.monthYear.split('-')[1];
      if (!acc[year]) {
        acc[year] = {
          year: year,
          productivityCuplumpDry: 0,
          productivityLatexDry: 0,
          productivityUSSDry: 0,
          productivityOthersDry: 0
        };
      }
      acc[year].productivityCuplumpDry += curr.productivityCuplumpDry || 0;
      acc[year].productivityLatexDry += curr.productivityLatexDry || 0;
      acc[year].productivityUSSDry += curr.productivityUSSDry || 0;
      acc[year].productivityOthersDry += curr.productivityOthersDry || 0;
      return acc;
    }, {});
  }

  createProductivityChart() {
    if (this.chartEstate) {
      this.chartEstate.destroy();
    }
  
    this.chartEstate = new Chart("chartProductivityEstate", {
      type: 'line',
      data: {
        labels: Object.keys(this.productivityByYear), // Use years as labels
        datasets: [
          {
            label: 'Cuplump Dry (Kg/Ha)',
            data: Object.values(this.productivityByYear).map((x:any) => x.productivityCuplumpDry),
            backgroundColor: 'blue',
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Latex Dry (Kg/Ha)',
            data: Object.values(this.productivityByYear).map((x:any) => x.productivityLatexDry),
            backgroundColor: 'limegreen',
            borderColor: 'limegreen',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  getFieldArea() {
    this.reportService.getFieldArea()
      .subscribe(
        Response => {
          const matureArea = Response.filter(x => x.isMature == true && x.estateId == this.sharedService.estateId)
          this.matureArea = matureArea.reduce((total, current) => total + current.area, 0);
          this.isLoadingMatureArea = false

          const immatureArea = Response.filter(x => x.isMature == false && x.estateId == this.sharedService.estateId)
          this.immatureArea = immatureArea.reduce((total, current) => total + current.area, 0);
          this.isLoadingImmatureArea = false
        }

      )
  }

  // createAreaChart() {
  //   if (this.barChart) {
  //     this.barChart.destroy();
  //   }

  //   this.barChart = new Chart("barChart", {
  //     type: 'bar',
  //     data: {
  //       labels: ['Mature Area', 'Immature Area'],
  //       datasets: [
  //         {
  //           label: 'Mature Area',
  //           data: [this.matureArea, 0], // Add 0 for the immature area to align bars
  //           backgroundColor: 'blue'
  //         },
  //         {
  //           label: 'Immature Area',
  //           data: [0, this.immatureArea], // Add 0 for the mature area to align bars
  //           backgroundColor: 'limegreen'
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     }
  //   });
  // }
}

