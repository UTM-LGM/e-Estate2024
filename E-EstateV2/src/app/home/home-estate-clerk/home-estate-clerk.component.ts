import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { LocalLabor } from 'src/app/_interface/localLabor';
import { BadgeService } from 'src/app/_services/badge.service';
import { CostAmountService } from 'src/app/_services/cost-amount.service';
import { EstateDetailService } from 'src/app/_services/estate-detail.service';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { RrimgeorubberIntegrationService } from 'src/app/_services/rrimgeorubber-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-home-estate-clerk',
  templateUrl: './home-estate-clerk.component.html',
  styleUrls: ['./home-estate-clerk.component.css']
})
export class HomeEstateClerkComponent implements OnInit, OnDestroy {

  productions: FieldProduction[] = []
  filterProductions: FieldProduction[] = []
  productionYearly: FieldProduction[] = []

  filterLocalLabors: LocalLabor[] = []

  sumCuplumpByMonthYear: any
  chartEstate: any

  estate: any = {} as any
  estateDetail: any = {} as any

  productivity: any[] = []
  workerShortages: any[] = []

  yearNow = ''
  totalCuplump = 0
  totalLatex = 0
  totalLocal = 0
  totalForeign = 0
  estateId = 0

  currentTotalTapper = 0
  currentTotalField = 0
  tapperShortage = 0
  fieldShortage = 0

  productivityCuplumpDry = 0
  productivityLatexDry = 0
  productivityUSSDry = 0
  productivityOthersDry = 0

  matureArea = 0
  immatureArea = 0
  tappedArea = 0

  totalCuplumpDry = 0
  totalLatexDry = 0
  totalProduction = 0
  badgeCount = 0



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

  productivityByYear: any
  polygonArea: number[] = []
  polygonTotalArea = 0

  filteredEstate: any = {} as any

  msnrStatus: boolean = false

  constructor(
    private reportService: ReportService,
    private myLesenService: MyLesenIntegrationService,
    private sharedService: SharedService,
    private estateService: EstateDetailService,
    private subscriptionService: SubscriptionService,
    private estateDetailService: EstateDetailService,
    private rrimGeoRubberService: RrimgeorubberIntegrationService,
    private badgeServie: BadgeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.badgeServie.badgeCount$.subscribe((count) => {
      this.badgeCount = count
    });
    if (this.sharedService.role != "Admin") {
      this.yearNow = new Date().getFullYear().toString()
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

  yearSelected(yearInput: HTMLInputElement): void {
    const year = yearInput.value;

    if (year.length > 4) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert a correct year',
      }).then(() => {
        // Reset the input value to the current year after the alert
        yearInput.value = this.yearNow;
      });
    } else {
      this.yearNow = year;
      this.getProductionReport()
      this.getWorker()
      this.getFieldArea()
      this.getWorkerShortage()
      this.getField()
      this.getProductivity()
    }
  }

  ngAfterViewInit() {
    this.getProductivity()
  }


  getField() {
    const getCurrentField = this.reportService.getFieldArea(this.yearNow.toString())
      .subscribe(
        Response => {
          const field = Response.filter(x => x.estateId == this.sharedService.estateId && x.fieldStatus?.toLowerCase().includes('tapped area') && x.isActive == true)
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
          this.workerShortages = response.filter(x => x.estateId == this.sharedService.estateId);
          if (this.workerShortages.length === 0) {
            this.tapperShortage = 0
            this.fieldShortage = 0
            this.isLoadingTapperShortage = false
            this.isLoadingFieldShortage = false
          }
          else {
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
          this.checkEstateDetail()
          this.isLoadingEstateName = false
        }
      )
    this.subscriptionService.add(getEstate);

  }

  getProductionReport() {
    this.totalCuplumpDry = 0
    this.totalLatexDry = 0
    this.totalProduction = 0
    const getCurrentProduction = this.reportService.getCurrentCropProduction(this.yearNow)
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
          else {
            for (const production of this.filterProductions) {
              this.totalCuplumpDry += production.cuplumpDry || 0;
              this.totalLatexDry += production.latexDry || 0;
              this.totalProduction = this.totalCuplumpDry + this.totalLatexDry
              this.isLoadingProduction = false
            }
          }
          this.isLoadingProduction = false
        }
      )
    this.subscriptionService.add(getCurrentProduction);


  }

  getWorker() {
    const getCurrentWorker = this.reportService.getCurrentTapperAndFieldWorker(this.yearNow)
      .subscribe(
        Response => {
          const worker = Response.filter(x => x.estateId == this.sharedService.estateId)
          if (worker.length === 0) {
            this.currentTotalTapper = 0
            this.currentTotalField = 0
            this.isLoadingTapper = false
            this.isLoadingField = false
          }
          else {
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
          next: (Response) => {
            this.productivity = Response.filter(x => x.estateId == this.sharedService.estateId);
            if (this.productivity.length === 0) {
              const product: any = {
                totalCuplumpDry: 0,
                totalLatexDry: 0,
                totalArea: 0,
                totalRubberDry: 0
              };
              this.productivity.push(product);
              this.productivityByYear = this.groupByYear(this.productivity);
              this.productivityByYear = this.productivityByYear.filter((x: any) => x.year == this.yearNow)
            } else {
              // Call the groupByYear function to group data by year and calculate sums
              this.productivityByYear = this.groupByYear(this.productivity);
              this.productivityByYear = this.productivityByYear.filter((x: any) => x.year == this.yearNow)
              // this.createProductivityChart(); // Call chart creation after data is processed
            }
            this.isLoadingProduction = false;
          },
          error: (err) => {
            console.error('Error fetching productivity data:', err);
            this.isLoadingProduction = false;
          }
        }
      );
    this.subscriptionService.add(getProductivity);

  }

  // Helper function to group data by year and calculate sums
  groupByYear(data: any) {
    const grouped = data.reduce((acc: any, curr: any) => {
      const year = curr.year
      if (!acc[year]) {
        acc[year] = {
          year: year,
          totalCuplumpDry: 0,
          totalLatexDry: 0,
          totalArea: 0,
          totalRubberDry: 0
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
    const totalRubberProductivity = this.productivityByYear.map((x: any) => x.totalRubberDry / x.totalArea);

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

  checkEstateDetail() {
    this.estateService.getEstateDetailbyEstateId(this.sharedService.estateId)
      .subscribe(
        Response => {
          if (Response != null) {
            this.estateDetail = Response;
            this.checkPDPA()
          } else {
            // If the estate detail is null, show the alert
            swal.fire({
              icon: 'info',
              title: 'Information',
              text: 'Please update Estate Profile in General',
            });
            this.router.navigateByUrl('/estate-detail/' + this.estate.id)
          }
        }
      )
  }

  checkPDPA() {
    if (this.estateDetail.isPDPA == false) {
      swal.fire({
        title: 'PDPA Consent Required',
        html: `
                <div style="position: relative; height: 348px; overflow: hidden;">
                  <iframe src="assets/PDPA-LGM.pdf" 
                     width="100%" 
                     height="100%" 
                  style="border: none; pointer-events: auto;"></iframe>
                </div>
                    `,
        icon: 'info',
        confirmButtonText: 'I Agree',
        allowOutsideClick: false, // <-- Prevent clicking outside
        allowEscapeKey: false,// <-- Prevent pressing ESC
        allowEnterKey: false, // <-- Optional: block ENTER key
        width: 800,
        didOpen: () => {
          const titleElement = document.querySelector('.swal2-title');
          if (titleElement) {
            (titleElement as HTMLElement).style.marginBottom = '0';
          }
          // Resize the icon after the alert opens
          const iconElement = document.querySelector('.swal2-icon');
          if (iconElement) {
            (iconElement as HTMLElement).style.width = '50px'; // Set desired width
            (iconElement as HTMLElement).style.height = '50px'; // Set desired height
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.estateDetail.isPDPA = true
          const { plantingMaterial, ...newObj } = this.estateDetail;
          this.filteredEstate = newObj;
          this.estateDetailService.updateEstateDetail(this.filteredEstate)
            .subscribe(
              Response => {
                if (this.estateDetail.msnrStatus == false || this.estateDetail.polygonArea == 0) {
                  this.getGeoJson();
                }
                else {
                  this.getGeoJson()
                }
              }
            )
        } else {
          this.router.navigateByUrl('/login')
          localStorage.clear()
        }
      });
    }

  }

  getGeoJson() {
    if (this.estate.licenseNo != undefined) {
      this.rrimGeoRubberService.getGeoRubber(this.estate.licenseNo)
        .subscribe(
          Response => {
            var features = Response.features;
            if (features != undefined) {
              if (Response.msnrStatus === 'Ya') {
                this.msnrStatus = true;
              } else if (Response.msnrStatus === 'Tidak') {
                this.msnrStatus = false;
              }
              features.forEach((feature: any) => {
                let geometry = feature.geometry;
                let properties = feature.properties;
                // Check if the geometry is of type 'Polygon' or 'MultiPolygon'
                if (geometry.type === 'Polygon') {
                  geometry.coordinates.forEach((coordinateSet: any) => {
                    this.polygonArea.push(properties.hectarage_of_marked_polygon);
                  });
                } else if (geometry.type === 'MultiPolygon') {
                  geometry.coordinates.forEach((polygonCoordinates: any) => {
                    polygonCoordinates.forEach((coordinateSet: any) => {
                      this.polygonArea.push(properties.hectarage_of_marked_polygon);
                    });
                  });
                }
              });
            } else {
              swal.fire({
                text: 'Estate is not listed in RRIM GeoRubber',
                icon: 'error'
              });
            }
            this.polygonTotalArea = this.polygonArea.reduce((acc, currentValue) => acc + currentValue, 0);
            this.updateEstate();
          },
          error => {
          }
        );
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot connect to RRIMGeoRubber',
      });
    }
  }


  updateEstate() {
    this.filteredEstate.id = this.estateDetail.id
    this.filteredEstate.plantingMaterialId = this.estateDetail.plantingMaterialId
    this.filteredEstate.polygonArea = this.polygonTotalArea
    this.filteredEstate.msnrStatus = this.msnrStatus
    this.estateDetailService.updateEstateDetail(this.filteredEstate)
      .subscribe({
        next: (response) => {

        },
        error: (err) => {
        }
      })
  }
}

