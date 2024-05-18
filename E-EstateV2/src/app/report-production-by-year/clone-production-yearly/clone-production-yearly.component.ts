import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-clone-production-yearly',
  templateUrl: './clone-production-yearly.component.html',
  styleUrls: ['./clone-production-yearly.component.css']
})
export class CloneProductionYearlyComponent implements OnInit {

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
    { columnName: 'no', displayText: 'No'},
    { columnName: 'cloneName', displayText: 'Clone Name' },
    { columnName: 'totalProduction', displayText: 'Total Production dry (Kg)' },
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
      if (this.year == '') {
        this.isLoading = false;
        this.cloneProduction = [];
      } else {
        const getProductivity = this.reportService.getProductivityByClone(this.year)
          .subscribe(
            Response => {
              this.cloneProduction = Response;
              this.isLoading = false;
  
              const cloneProduction = new Map();
              this.cloneProduction.forEach(field => {
                const { fieldId, cuplumpDry, latexDry, ussDry, othersDry, fieldClone, area } = field;
                const totalProduction = cuplumpDry + latexDry + ussDry + othersDry;
  
                if (fieldClone && fieldClone.length > 1) { // Check if fieldClone has more than 1 element
                  const mixedCloneName = 'MIXED CLONE';
                  if (cloneProduction.has(mixedCloneName)) {
                    cloneProduction.set(mixedCloneName, {
                      totalProduction: cloneProduction.get(mixedCloneName).totalProduction + totalProduction,
                      area: cloneProduction.get(mixedCloneName).area + area
                    });
                  } else {
                    cloneProduction.set(mixedCloneName, { totalProduction, area });
                  }
                } else if (fieldClone && fieldClone.length === 1) { // Check if fieldClone has exactly 1 element
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
                // Do nothing if fieldClone is empty
              });
  
              cloneProduction.forEach((value, cloneName) => {
                this.cloneProductionData.push({ cloneName, ...value });
              });
  
            });
      this.subscriptionService.add(getProductivity);

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

  exportToExcel(data:any[], fileName:String){
    let bilCounter = 1
    const filteredData = data.map(row =>({
      No:bilCounter++,
      CloneName:row.cloneName,
      TotalProductionDry: row.totalProduction.toFixed(2),
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
