import { Component, OnDestroy, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ReportService } from '../_services/report.service';
import { SharedService } from '../_services/shared.service';
import { SubscriptionService } from '../_services/subscription.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-report-rubber-area-by-clone',
  templateUrl: './report-rubber-area-by-clone.component.html',
  styleUrls: ['./report-rubber-area-by-clone.component.css']
})
export class ReportRubberAreaByCloneComponent implements OnInit, OnDestroy {

  role = ''
  year = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  term = ''
  startMonth = ''
  endMonth = ''

  estate: any = {} as any
  companies: any[] = []

  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  company: any = {} as any

  cloneArea: any[] = []
  cloneAreaData: any = [];

  sortableColumns = [
    { columnName: 'no', displayText: 'No'},
    { columnName: 'cloneName', displayText: 'Clone Name' },
    { columnName: 'area', displayText: 'Rubber Area (Ha)' },
  ];

  constructor(
    private reportService: ReportService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString()
    this.role = this.sharedService.role
    this.isLoading = false
  }

  companySelected() {
    this.estate.id = 0
  }

  monthChange() {
    this.isLoading = true
    this.getAreaClone()
  }

  chageStartMonth() {
    this.endMonth = ''
    this.cloneArea =[]
  }

  yearSelected() {
    this.cloneAreaData = []
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.getAreaClone()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
    }
  }

  getAreaClone() {
    setTimeout(() => {
      const getArea = this.reportService.getAreaByAllClone(this.startMonth, this.endMonth)
      .subscribe(
        Response => {
          this.cloneArea = this.processCloneArea(Response);
          this.isLoading = false;
        }
      )
    this.subscriptionService.add(getArea);
    }, 2000);
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
    const filteredData:any = data.map(row =>({
      No:bilCounter++,
      CloneName:row.cloneName,
      TotalRubberArea: row.totalArea
    }))

    const headerRow = [
      { No: 'Start Month Year:', CloneName: this.startMonth},
      { No: 'End Month Year:', CloneName: this.endMonth},
      {}, // Empty row for separation
      { No: 'No', CloneName: 'CloneName', TotalRubberArea: 'TotalRubberArea'}
    ];

    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1' );
    const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
