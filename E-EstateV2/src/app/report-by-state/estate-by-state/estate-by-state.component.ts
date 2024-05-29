import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-estate-by-state',
  templateUrl: './estate-by-state.component.html',
  styleUrls: ['./estate-by-state.component.css']
})
export class EstateByStateComponent implements OnInit, OnDestroy {

  term = ''
  order = ''
  currentSortedColumn = ''
  year = ''

  pageNumber = 1
  isLoading = true
  estates: any[] = []
  stateTotalAreas = {} as any;
  stateTotalAreasArray:any[]=[]

  sortableColumns = [
    { columnName: 'state', displayText: 'State' },
    { columnName: 'estateNo', displayText: 'No of Estate' },
    { columnName: 'rubberArea', displayText: 'Total Rubber Area (Ha)' },
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService:ReportService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString()
    this.getEstate()
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  getEstate() {
    setTimeout(() => {
      const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(
        estates => {
        this.estates = estates;
        this.calculateTotalAllArea();
      });
      this.subscriptionService.add(getAllEstate);
    }, 2000);
  }

  calculateTotalAllArea() {
    const observables = this.estates.map(estate => 
      this.reportService.getFieldArea(this.year).pipe(
        map(response => ({
          estateId: estate.id,
          state: estate.state,
          fields: response.filter(x => x.estateId === estate.id && x.isActive === true && 
            !x.fieldStatus.toLowerCase().includes('abandoned') && 
            !x.fieldStatus.toLowerCase().includes('government') && 
            !x.fieldStatus.toLowerCase().includes('conversion to other crop'))
        }))
      )
    );
  
    forkJoin(observables).subscribe(results => {
      this.stateTotalAreas = {};
  
      results.forEach(result => {
        const totalArea = result.fields.reduce((acc, curr) => acc + curr.area, 0);
  
        if (!this.stateTotalAreas[result.state]) {
          this.stateTotalAreas[result.state] = { count: 1, totalArea: totalArea };
        } else {
          this.stateTotalAreas[result.state].count++;
          this.stateTotalAreas[result.state].totalArea += totalArea;
        }
      });
  
      // Convert object to array
      this.stateTotalAreasArray = Object.keys(this.stateTotalAreas).map(key => ({
        state: key,
        estateNo: this.stateTotalAreas[key].count,
        totalArea: this.stateTotalAreas[key].totalArea
      }));
 
      this.isLoading = false;
    });
  }

  yearSelected() {
    this.estates = []
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.stateTotalAreas = {};
      this.getEstate()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
    }
  }

  exportToExcel(data:any[], fileName:String){
    let bilCounter = 1
    const filteredData = data.map(row =>({
      No:bilCounter++,
      State:row.state,
      EstateNo: row.estateNo,
      TotalRubberArea: row.totalArea
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
