import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { ForeignLabor } from 'src/app/_interface/foreignLabor';
import { LocalLabor } from 'src/app/_interface/localLabor';
import { EstateService } from 'src/app/_services/estate.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-home-estate-clerk',
  templateUrl: './home-estate-clerk.component.html',
  styleUrls: ['./home-estate-clerk.component.css']
})
export class HomeEstateClerkComponent implements OnInit {

  @ViewChild('myCanvas') myCanvas: any
  @ViewChild('myCanvas1') myCanvas1: any


  productions: FieldProduction[] = []
  filterProductions: FieldProduction[] = []
  productionYearly: FieldProduction[] = []

  filterLocalLabors: LocalLabor[] = []

  filterForeignWorker: ForeignLabor[] = []

  sumCuplumpByMonthYear: any

  estate: Estate = {} as Estate

  yearNow = 0
  totalCuplump = 0
  totalLatex = 0
  totalLocal = 0
  totalForeign = 0
  estateId = ''
  isLoadingEstateName = true
  isLoadingProduction = true
  isLoadingLocal = true
  isLoadingForeign = true
  showAlert = false

  constructor(
    private reportService: ReportService,
    private authGuard: AuthGuard,
    private estateService: EstateService
  ) { }

  ngOnInit() {
    if(this.authGuard.getRole() != "Admin"){
      this.yearNow = new Date().getFullYear()
      this.estateId = this.authGuard.getEstateId()
      this.checkDate()
      this.getEstate()
      this.getProduction()
      this.getLocalWorker()
      this.getForeignWorker()
    }
  }

  ngAfterViewInit() {
    this.createChart()
    this.createChart1()
  }

  checkDate() {
    const today = new Date()
    const isNovember = today.getMonth() === 10 // Note: JavaScript months are 0-based
    if (isNovember) {
      this.showAlert = true
    }
  }

  getEstate() {
    this.estateService.getOneEstate(parseInt(this.estateId))
      .subscribe(
        Response => {
          this.estate = Response
          this.isLoadingEstateName = false
        }
      )
  }

  getProduction() {
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

  getLocalWorker() {
    this.reportService.getCurrentLocalWorker()
      .subscribe(
        Response => {
          const localLabors = Response || []; // Ensure localLabors is an array
          if (localLabors.some(x => x && x.estateId === this.estateId)) {
            this.filterLocalLabors = localLabors.filter(x => x && x.estateId === this.estateId);
          } else {
            const localLabor: any = {
              totalLaborWorker: 0
            };
            this.filterLocalLabors.push(localLabor)
          }
          this.isLoadingLocal = false
        }
      )
  }

  getForeignWorker() {
    this.reportService.getCurrentForeignWorker()
      .subscribe(
        Response => {
          const foreignLabors = Response
          if (foreignLabors.some(x => x && x.estateId === this.estateId)) {
            this.filterForeignWorker = foreignLabors.filter(x => x.estateId == this.estateId)
          } else {
            const foreignLabor: any = {
              totalLaborWorker: 0
            };
            this.filterForeignWorker.push(foreignLabor)
          }
          this.isLoadingForeign = false
        }
      )
  }

  createChart() {
    this.yearNow = 2022
    this.reportService.getProductionYearly(this.yearNow.toString())
      .subscribe(
        Response => {
          const productionYearly = Response
          this.productionYearly = productionYearly.filter(x => x.estateId == this.estateId)
          const ctx = this.myCanvas.nativeElement.getContext('2d');
          const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.productionYearly.map(p => `${p.monthYear}`),
              datasets: [
                {
                  label: "Cumplump Dry (Kg)",
                  data: this.productionYearly.map(p => p.cuplumpDry),
                  backgroundColor: 'blue'
                },
                {
                  label: "Latex Dry (Kg)",
                  data: this.productionYearly.map(p => p.latexDry),
                  backgroundColor: 'limegreen'
                },
                {
                  label: "USS Dry (Kg)",
                  data: this.productionYearly.map(p => p.ussDry),
                  backgroundColor: 'orange'
                },
                {
                  label: "Others Dry (Kg)",
                  data: this.productionYearly.map(p => p.othersDry),
                  backgroundColor: 'pink'
                }
              ]
            }
          });
        })
  }

  createChart1() {
    this.yearNow = 2022
    this.reportService.getProductionYearly(this.yearNow.toString())
      .subscribe(
        Response => {
          const productionYearly = Response
          this.productionYearly = productionYearly.filter(x => x.estateId == this.estateId)
          const ctx = this.myCanvas1.nativeElement.getContext('2d');
          const myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.productionYearly.map(p => `${p.monthYear}`),
              datasets: [
                {
                  label: "Cumplump Dry (Kg)",
                  data: this.productionYearly.map(p => p.cuplumpDry),
                  backgroundColor: 'blue'
                },
                {
                  label: "Latex Dry (Kg)",
                  data: this.productionYearly.map(p => p.latexDry),
                  backgroundColor: 'limegreen'
                },
                {
                  label: "USS Dry (Kg)",
                  data: this.productionYearly.map(p => p.ussDry),
                  backgroundColor: 'orange'
                },
                {
                  label: "Others Dry (Kg)",
                  data: this.productionYearly.map(p => p.othersDry),
                  backgroundColor: 'pink'
                }
              ]
            }
          });
        })
  }
}

