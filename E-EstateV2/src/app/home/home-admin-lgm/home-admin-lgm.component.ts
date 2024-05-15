import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { forkJoin, map } from 'rxjs';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-home-admin-lgm',
  templateUrl: './home-admin-lgm.component.html',
  styleUrls: ['./home-admin-lgm.component.css']
})
export class HomeAdminLGMComponent implements OnInit {

  totalEstate = 0
  totalCompany = 0
  yearNow = 0

  totalCuplumpDry = 0
  totalLatexDry = 0
  totalUSSDry = 0
  totalOthersDry = 0

  productivityCuplumpDry = 0
  productivityLatexDry = 0
  productivityUSSDry = 0
  productivityOthersDry = 0

  currentTotalTapper = 0
  currentTotalField = 0

  filterEstates: Estate[] = []

  filterCompanies: Company[] = []

  productions: FieldProduction[] = []
  productivity: any[] = []
  workerShortages: any[] = []


  isLoadingCompany = true
  isLoadingEstate = true
  isLoadingTapper = true
  isLoadingField = true
  isLoadingTapperNeeded = true
  isLoadingFieldNeeded = true
  isLoadingProduction = true
  isLoadingTapperShortage = true
  isLoadingFieldShortage = true
  isLoadingTapped = true
  isLoadingCop = true

  chart: any
  productivityByYear:any

  totalTapperNeeded = 0
  totalFieldNeeded = 0
  tapperShortage = 0
  fieldShortage =0
  tappedArea = 0
  costAmount = 0


  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService: ReportService,
    private fieldService:FieldService
  ) { }

  ngOnInit() {
    this.getCompany()
    this.getEstate()
    this.getProduction()
    this.yearNow = new Date().getFullYear()
    this.getWorker()
    this.getWorkerShortage()
    this.getField()
    this.getCostInformation()
  }

  ngAfterViewInit() {
    this.getProductivity()

  }

  getCostInformation(){
    this.reportService.getCostInformation(this.yearNow.toString())
    .subscribe(
      Response =>{
        this.costAmount = Response.reduce((sum, estate)=> sum + estate.amount, 0)
        this.isLoadingCop = false
      }
    )
  }

  getField(){
    this.reportService.getCurrentField(this.yearNow.toString())
    .subscribe(
      Response =>{
        const field = Response.filter(x=>x.isActive == true && x.fieldStatus.toLowerCase().includes('tapped area'))
        this.tappedArea = field.reduce((sum, field) => sum + field.area, 0)
        this.isLoadingTapped = false
      }
    )
  }

  getWorkerShortage() {
    this.reportService.getWorkerShortageEstate().subscribe(
      response => {
        this.workerShortages = response;
        if(this.workerShortages.length === 0)
          {
            this.totalTapperNeeded = 0
            this.totalFieldNeeded = 0
            this.tapperShortage = 0
            this.fieldShortage = 0
            this.isLoadingTapperNeeded = false
            this.isLoadingFieldNeeded = false
            this.isLoadingTapperShortage = false
            this.isLoadingFieldShortage = false
          }
          else{
            this.tapperShortage = this.workerShortages.reduce((sum, workerShortage) => sum + workerShortage.tapperShortage, 0)
            this.fieldShortage = this.workerShortages.reduce((sum, workerShortage) => sum + workerShortage.fieldShortage, 0);
            this.isLoadingTapperShortage = false
            this.isLoadingFieldShortage = false
            const estateRequests = this.workerShortages.map(workerShortage => {
              return this.myLesenService.getOneEstate(workerShortage.estateId).pipe(
                map(estateResponse => {
                  workerShortage.estateName = estateResponse.name; // Assuming estate name is in 'name' property
                })
              );
            });
            forkJoin(estateRequests).subscribe(() => {
              this.getLabor();
            });
          }
      }
    );
  }

  getLabor() {
    this.reportService.getCurrentTapperAndFieldWorker().subscribe(
      Response => {
        const labors = Response;
        this.workerShortages.forEach(workerShortage => {
          workerShortage.filterLabors = labors.filter(e => e.estateId == workerShortage.estateId);
        });
        this.totalTapperNeeded = this.calculateTotalTapperSum(this.workerShortages);
        this.totalFieldNeeded = this.calculateTotalFieldSum(this.workerShortages);
        this.isLoadingTapperNeeded = false
        this.isLoadingFieldNeeded = false
      }
    );
  }

  calculateTapperSum(worker: any): number {
    if (worker && worker.filterLabors && worker.tapperShortage) {
      return worker.filterLabors.reduce((sum:any, labor:any) => sum + labor.tapperCheckrole + labor.tapperContractor, 0) + worker.tapperShortage;
    } else {
      return 0; // Return 0 if any of the properties are undefined or null
    }
  }
  
  
  calculateFieldSum(worker: any) {
    if (worker && worker.filterLabors && worker.tapperShortage) {
      return worker.filterLabors.reduce((sum:any, labor:any) => sum + labor.fieldCheckrole + labor.fieldContractor, 0) + worker.fieldShortage;
    } else {
      return 0; // Return 0 if any of the properties are undefined or null
    }
  }

  calculateTotalTapperSum(workerShortages: any[]): number {
    return workerShortages.reduce((sum, workerShortage) => sum + this.calculateTapperSum(workerShortage), 0);
  }
  
  calculateTotalFieldSum(workerShortages: any[]): number {
    return workerShortages.reduce((sum, workerShortage) => sum + this.calculateFieldSum(workerShortage), 0);
  }

  getCompany() {
    this.myLesenService.getAllCompany()
      .subscribe(
        Response => {
          this.filterCompanies = Response
          this.totalCompany = this.filterCompanies.length
          this.isLoadingCompany = false
        }
      )

  }

  getEstate() {
    this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterEstates = Response
          this.totalEstate = this.filterEstates.length
          this.isLoadingEstate = false
        }
      )
  }

  getProduction() {
    this.reportService.getCurrentCropProduction()
      .subscribe(
        Response => {
          this.productions = Response
          if (this.productions.length === 0) {
            const product: any = {
              cuplumpDry: 0,
              latexDry: 0,
              ussDry: 0,
              othersDry: 0,
            };
            this.productions.push(product)
            
          }
          else {
            for (const production of this.productions) {
              this.totalCuplumpDry += production.cuplumpDry || 0;
              this.totalLatexDry += production.latexDry || 0;
              this.totalUSSDry += production.ussDry || 0;
              this.totalOthersDry += production.othersDry || 0;
              this.isLoadingProduction = false
            }
          }
        }
      )
  }

  getProductivity() {
    this.reportService.getCropProductivity()
      .subscribe(
        {
          next:(Response)=>{
            this.productivity = Response;
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
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart("chartProductivityAdmin", {
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
  
  getWorker() {
    this.reportService.getCurrentTapperAndFieldWorker()
      .subscribe(
        Response => {
          if (Response.length === 0) {
            this.currentTotalTapper = 0;
            this.currentTotalField = 0;
            this.isLoadingTapper = false
            this.isLoadingField = false


          } else {
            Response.forEach(item => {
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

  getCalculatedCop(){
    const value = (this.totalCuplumpDry + this.totalLatexDry) / this.costAmount;
    return isNaN(value) ? 0 : value;
  }
}
