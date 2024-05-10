import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clone-productivity-yearly',
  templateUrl: './clone-productivity-yearly.component.html',
  styleUrls: ['./clone-productivity-yearly.component.css']
})
export class CloneProductivityYearlyComponent implements OnInit {

  role = ''
  year = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  term = ''


  estate: any = {} as any
  companies: any[] = []

  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  company: any = {} as any

  cloneProduction: any[] = []
  cloneProductionData: any = [];


  sortableColumns = [
    { columnName: 'cloneName', displayText: 'Clone Name' },
    { columnName: 'totalProduction', displayText: 'Total Production (Kg)' },
    { columnName: 'area', displayText: 'Clone Area (Ha)' },
    { columnName: 'productivity', displayText: 'Productivity (Kg/Ha)' }
  ];

  constructor(
    private reportService: ReportService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.getProductionYearly()
  }

  companySelected() {
    this.estate.id = 0
  }

  yearSelected() {
    this.cloneProductionData = []
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.getProductionYearly()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
    }
  }

  getProductionYearly() {
    setTimeout(() => {
      if (this.year == '') {
        this.isLoading = false;
        this.cloneProduction = [];
      } else {
        this.reportService.getProductivityByClone(this.year)
          .subscribe(
            Response => {
              this.cloneProduction = Response;
              this.isLoading = false

              const cloneProduction = new Map();
              this.cloneProduction.forEach(field => {
                const { fieldId, cuplumpDry, latexDry, ussDry, othersDry, fieldClone, area } = field;
                const totalProduction = cuplumpDry + latexDry + ussDry + othersDry;

                if (fieldClone.length > 1) {
                  const mixedCloneName = 'MIXED CLONE';
                  if (cloneProduction.has(mixedCloneName)) {
                    cloneProduction.set(mixedCloneName, {
                      totalProduction: cloneProduction.get(mixedCloneName).totalProduction + totalProduction,
                      area: cloneProduction.get(mixedCloneName).area + area
                    });

                  } else {
                    cloneProduction.set(mixedCloneName, { totalProduction, area });
                  }
                } else {
                  const { cloneName } = fieldClone[0];
                  if (cloneProduction.has(cloneName)) {
                    cloneProduction.set(cloneName, {
                      totalProduction: cloneProduction.get(cloneName).totalProduction + totalProduction,
                      area: cloneProduction.get(cloneName).area + area
                    });
                  } else {
                    cloneProduction.set(cloneName, { totalProduction, area });
                  }
                }
              });

              cloneProduction.forEach((value, cloneName) => {
                this.cloneProductionData.push({ cloneName, ...value });
              });

            });
      }
    }, 2000);
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }
}
