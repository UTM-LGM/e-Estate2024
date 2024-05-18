import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';


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

  cloneArea :any[]=[]


  sortableColumns = [
    { columnName: 'no', displayText: 'No'},
    { columnName: 'cloneName', displayText: 'Clone Name' },
    { columnName: 'totalProduction', displayText: 'Total Production (Kg)' },
    { columnName: 'area', displayText: 'Clone Area (Ha)' },
    { columnName: 'productivity', displayText: 'Productivity (Kg/Ha)' }
  ];

  constructor(
    private reportService: ReportService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString()
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
      if (this.year === '') {
        this.isLoading = false;
        this.cloneProduction = [];
      } else {
        const getProductivity = this.reportService.getProductivityByClone(this.year)
          .subscribe(
            (response: any) => {
              this.cloneProduction = response;
              this.isLoading = false;
  
              const cloneProduction = new Map<string, { totalProduction: number }>();
              this.cloneProduction.forEach(field => {
                const { fieldId, cuplumpDry, latexDry, ussDry, othersDry, fieldClone } = field;
                const totalProduction = cuplumpDry + latexDry + ussDry + othersDry;
  
                if (fieldClone.length > 1) {
                  const mixedCloneName = 'MIXED CLONE';
                  if (cloneProduction.has(mixedCloneName)) {
                    cloneProduction.set(mixedCloneName, {
                      totalProduction: cloneProduction.get(mixedCloneName)!.totalProduction + totalProduction,
                    });
                  } else {
                    cloneProduction.set(mixedCloneName, { totalProduction });
                  }
                } else if (fieldClone.length === 1) {
                  const { cloneName } = fieldClone[0];
                  if (cloneProduction.has(cloneName)) {
                    cloneProduction.set(cloneName, {
                      totalProduction: cloneProduction.get(cloneName)!.totalProduction + totalProduction,
                    });
                  } else {
                    cloneProduction.set(cloneName, { totalProduction });
                  }
                }
              });
  
              this.cloneProductionData = [];
              cloneProduction.forEach((value, cloneName) => {
                this.cloneProductionData.push({ cloneName, ...value });
              });
              this.getAreaClone()  
            },
            error => {
              console.error('Error fetching data', error);
              this.isLoading = false;
            }
          );
      this.subscriptionService.add(getProductivity);

      }
    }, 2000);
  }

  getAreaClone() {
    setTimeout(() => {
      if (this.year === '') {
        this.isLoading = false;
        this.cloneArea = [];
      } else {
        const getArea = this.reportService.getAreaByClone(this.year)
          .subscribe(
            Response=>{
              this.cloneArea = this.processCloneArea(Response);
              this.isLoading = false;

              // Iterate over each object in this.cloneProductionData
              this.cloneProductionData.forEach((prod: any) => {
                // Find the corresponding area data using the cloneName
                const area = this.cloneArea.find((area: any) => area.cloneName === prod.cloneName);
            
                // If area data is found, add the totalArea property to the existing object
                if (area) {
                    prod.totalArea = area.totalArea;
                }
            });            
            }
          )
      this.subscriptionService.add(getArea);

      }
    }, 0);
  }
  
  processCloneArea(data: any[]) {
    let cloneAreaMap = new Map<string, number>();
    let mixedCloneArea = 0;
  
    data.forEach(field => {
      if (field.cloneNames.length > 1) {
        mixedCloneArea += field.area;
      } else {
        const cloneNames = field.cloneNames[0];
        if (cloneAreaMap.has(cloneNames)) {
          cloneAreaMap.set(cloneNames, cloneAreaMap.get(cloneNames)! + field.area);
        } else {
          cloneAreaMap.set(cloneNames, field.area);
        }
      }
    });
  
    let result = Array.from(cloneAreaMap.entries()).map(([cloneName, totalArea]) => ({
      cloneName: cloneName,
      totalArea: totalArea
    }));
  
    if (mixedCloneArea > 0) {
      result.push({
        cloneName: 'MIXED CLONE',
        totalArea: mixedCloneArea
      });
    }
    return result;
  }
  

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  exportToExcel(data:any[], fileName:String){
    let bilCounter = 1
    const filteredData = data.map(row =>({
      No:bilCounter++,
      CloneName:row.cloneName,
      TotalProduction: row.totalProduction.toFixed(2),
      CloneArea: row.totalArea,
      Productivity:(row.totalProduction / row.totalArea).toFixed(2)
    }))

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.year);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
