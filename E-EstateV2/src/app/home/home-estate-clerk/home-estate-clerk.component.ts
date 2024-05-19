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
import { SubscriptionService } from 'src/app/_services/subscription.service';

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

  totalCuplumpDry = 0
  totalLatexDry = 0

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

  productivityByYear:any

  constructor(
    private reportService: ReportService,
    private myLesenService: MyLesenIntegrationService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
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
      this.getWorkerShortage()
      this.getField()
    }
  }

  ngAfterViewInit() {
    this.getProductivity()
  }

  getField(){
   const getCurrentField = this.reportService.getCurrentField(this.yearNow.toString())
    .subscribe(
      Response =>{
        const field = Response.filter(x=>x.estateId == this.sharedService.estateId && x.fieldStatus.toLowerCase().includes('tapped area'))
        this.tappedArea = field.reduce((sum, field) => sum + field.area, 0)
        this.isLoadingTappedArea = false
      }
    )
    this.subscriptionService.add(getCurrentField);

  }

  getWorkerShortage() {
    const getWorkerShortage = this.reportService.getWorkerShortageEstate(this.yearNow.toString())
    .subscribe(
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
    this.subscriptionService.add(getWorkerShortage);

  }

  checkDate() {
    const today = new Date()
    const isNovember = today.getMonth() === 10 // Note: JavaScript months are 0-based
    if (isNovember) {
      this.showAlert = true
    }
  }

  getEstate() {
    const getEstate = this.myLesenService.getOneEstate(this.estateId)
      .subscribe(
        Response => {
          this.estate = Response
          this.isLoadingEstateName = false
        }
      )
      this.subscriptionService.add(getEstate);

  }

  getProductionReport() {
    const getCurrentProduction = this.reportService.getCurrentCropProduction()
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
          else{
            for (const production of this.filterProductions) {
              this.totalCuplumpDry += production.cuplumpDry || 0;
              this.totalLatexDry += production.latexDry || 0;
              this.isLoadingProduction = false
            }
          }
          this.isLoadingProduction = false
        }
      )
      this.subscriptionService.add(getCurrentProduction);


  }

  getWorker() {
    const getCurrentWorker = this.reportService.getCurrentTapperAndFieldWorker()
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
      this.subscriptionService.add(getCurrentWorker);

  }

  getProductivity() {
    const getProductivity = this.reportService.getCropProductivity()
      .subscribe(
        {
          next:(Response)=>{
            this.productivity = Response.filter(x=>x.estateId == this.sharedService.estateId);
            if (this.productivity.length === 0) {
              const product: any = {
                totalCuplumpDry: 0,
                totalLatexDry: 0,
                totalArea: 0,
                totalRubberDry : 0
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
      this.subscriptionService.add(getProductivity);

  }

  // Helper function to group data by year and calculate sums
  groupByYear(data:any) {
    const grouped = data.reduce((acc:any, curr:any) => {
      const year = curr.year
      if (!acc[year]) {
        acc[year] = {
          year: year,
          totalCuplumpDry: 0,
          totalLatexDry: 0,
          totalArea: 0,
          totalRubberDry : 0
        };
      }
      acc[year].totalCuplumpDry += curr.totalCuplumpDry || 0;
      acc[year].totalLatexDry += curr.totalLatexDry || 0;
      acc[year].totalRubberDry += (curr.totalCuplumpDry || 0) + (curr.totalLatexDry || 0);
      acc[year].totalArea += curr.area || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  }

  createProductivityChart() {
    if (this.chartEstate) {
      this.chartEstate.destroy();
    }

    const years = this.productivityByYear.map((x: any) => x.year);
    const totalRubberProductivity = this.productivityByYear.map((x:any)=> x.totalRubberDry/x.totalArea);
  
    this.chartEstate = new Chart("chartProductivityEstate", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Rubber Dry (Kg/Ha)',
            data: totalRubberProductivity,
            backgroundColor: 'blue',
            borderColor: 'blue',
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
    const getFieldArea = this.reportService.getFieldArea(this.yearNow.toString())
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
      this.subscriptionService.add(getFieldArea);

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}

