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
  startMonth = ''
  endMonth = ''

  pageNumber = 1
  isLoading = true
  estates: any[] = []
  stateTotalAreas = {} as any;
  stateTotalAreasArray: any[] = []

  sortableColumns = [
    { columnName: 'state', displayText: 'State' },
    { columnName: 'estateNo', displayText: 'No of Estate' },
    { columnName: 'currentEstate', displayText : 'Registered estate in RRIMestet'},
    { columnName: 'rubberArea', displayText: 'Total Rubber Area (Ha)' },
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService: ReportService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    // this.year = new Date().getFullYear().toString()
    this.isLoading = false
  }

  monthChange() {
    this.isLoading = true
    this.getEstate()
    
  }

  chageStartMonth() {
    this.endMonth = ''
    this.stateTotalAreasArray =[]
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
      const getAllEstate = this.myLesenService.getAllActiveEstate()
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
      this.reportService.getStateFieldArea(this.startMonth, this.endMonth).pipe(
        map(response => ({
          stateId:estate.stateId,
          estateId: estate.id,
          state: estate.state,
          fields: response.filter(x => x.estateId === estate.id && x.isActive === true &&
            !x.fieldStatus?.toLowerCase().includes('abandoned') &&
            !x.fieldStatus?.toLowerCase().includes('government') &&
            !x.fieldStatus?.toLowerCase().includes('conversion to other crop'))
        }))
      )
    );

    forkJoin(observables).subscribe(results => {
      this.stateTotalAreas = {};
      results.forEach(result => {
        const totalArea = result.fields.reduce((acc, curr) => acc + curr.area, 0);

        const registeredEstateCount = result.fields.length != 0;


        if (!this.stateTotalAreas[result.state]) {
          this.stateTotalAreas[result.state] = { 
            count: 1, 
            totalArea: totalArea, 
            registeredEstates: registeredEstateCount,
            stateId: result.stateId 
          };
        } else {
          this.stateTotalAreas[result.state].count++;
          this.stateTotalAreas[result.state].totalArea += totalArea;
          this.stateTotalAreas[result.state].registeredEstates += registeredEstateCount;
        }
      });

      // Convert object to array
      this.stateTotalAreasArray = Object.keys(this.stateTotalAreas).map(key => ({
        state: key,
        estateNo: this.stateTotalAreas[key].count,
        totalArea: this.stateTotalAreas[key].totalArea,
        stateId:this.stateTotalAreas[key].stateId,
        registeredEstates: this.stateTotalAreas[key].registeredEstates,
      }));

    });
    this.isLoading = false;

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


  exportToExcel(data: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData: any = data.map(row => ({
      No: bilCounter++,
      State: row.state,
      EstateNo: row.estateNo,
      TotalRubberArea: row.totalArea
    }));

    // Add a header row with the start and end month-year values
    const headerRow = [
      { No: 'Start Month Year:', State: this.startMonth},
      { No: 'End Month Year:', State: this.endMonth},
      {}, // Empty row for separation
      { No: 'No', State: 'State', EstateNo: 'EstateNo', TotalRubberArea: 'TotalRubberArea(Ha)' }
    ];

    // Combine the header row with the filtered data
    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Format the filename to include start and end month-year
    const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  calculateTotal(){
    return this.stateTotalAreasArray.reduce((total, item) => total + item.totalArea, 0)

  }

  calculateEstate(){
    return this.stateTotalAreasArray.reduce((total, item) => total + item.estateNo, 0)
  }

  calculateRegisteredEstate(){
    return this.stateTotalAreasArray.reduce((total, item) => total + item.registeredEstates, 0)
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

 

}
