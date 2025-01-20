import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { FieldService } from 'src/app/_services/field.service';
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
    { columnName: 'currentEstate', displayText: 'Registered rubber area (No of Estate)' },
    { columnName: 'rubberArea', displayText: 'Total Rubber Area (Ha)' },
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService: ReportService,
    private fieldService: FieldService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    // this.year = new Date().getFullYear().toString()
    this.isLoading = false
  }

  monthChange() {
    this.isLoading = true
    this.stateTotalAreasArray = []
    this.getEstate()
  }

  chageStartMonth() {
    this.endMonth = ''
    this.stateTotalAreasArray = []
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
    const startDate = new Date(`${this.startMonth}-01`);
    const endDate = new Date(`${this.endMonth}`);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
  
    const observables = this.estates.map(estate =>
      this.reportService.getStateFieldAreaById(estate.id).pipe(
        map(response => ({
          stateId: estate.stateId,
          estateId: estate.id,
          state: estate.state,
          fields: response.filter(x => {
            const createdDate = new Date(x.createdDate); // Ensure the createdDate is correctly parsed into Date
            return (
              x.estateId === estate.id &&
              createdDate >= startDate &&
              createdDate <= endDate &&
              x.isActive === true &&
              (
                  x.fieldStatus?.toLowerCase().includes('abandoned - untapped') ||
                  x.fieldStatus?.toLowerCase().includes('tapped area') ||
                  // x.fieldStatus?.toLowerCase().includes('conversion other crop to rubber') ||
                  x.fieldStatus?.toLowerCase().includes('new planting') ||
                  x.fieldStatus?.toLowerCase().includes('replanting')
              )
          );
        })
        }))
      )
    );
  
    forkJoin(observables).subscribe(results => {
      this.stateTotalAreas = {};
  
      // Initialize `count` based on estates
      this.estates.forEach(estate => {
        if (!this.stateTotalAreas[estate.state]) {
          this.stateTotalAreas[estate.state] = {
            count: 0,
            totalArea: 0,
            registeredEstates: 0,
            stateId: estate.stateId
          };
        }
        this.stateTotalAreas[estate.state].count++;
      });
  
      // Calculate `totalArea` and `registeredEstates`
      results.forEach(result => {
        if (result.fields && result.fields.length > 0) {
          const totalArea = result.fields.reduce((acc, curr) => acc + (curr.rubberArea || 0), 0);
  
          const uniqueEstates = new Set(result.fields.map(field => field.estateId));
          const registeredEstateCount = uniqueEstates.size;
  
          if (this.stateTotalAreas[result.state]) {
            this.stateTotalAreas[result.state].totalArea += totalArea;
            this.stateTotalAreas[result.state].registeredEstates += registeredEstateCount;
          }
        }
      });
  
      // Convert object to array
      this.stateTotalAreasArray = Object.keys(this.stateTotalAreas).map(key => ({
        state: key,
        estateNo: this.stateTotalAreas[key].count,
        totalArea: this.stateTotalAreas[key].totalArea,
        stateId: this.stateTotalAreas[key].stateId,
        registeredEstates: this.stateTotalAreas[key].registeredEstates,
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


  exportToExcel(data: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData: any = data.map(row => ({
      No: bilCounter++,
      State: row.state,
      EstateNo: row.estateNo,
      RegisteredEstate: row.registeredEstates,
      TotalRubberArea: row.totalArea
    }));

    // Add a header row with the start and end month-year values
    const headerRow = [
      { No: 'Start Month Year:', State: this.startMonth },
      { No: 'End Month Year:', State: this.endMonth },
      {}, // Empty row for separation
      { No: 'No', State: 'State', EstateNo: 'EstateNo', RegisteredEstate: 'RegisteredRubberArea(NoOfEstate)', TotalRubberArea: 'TotalRubberArea(Ha)' }
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

  calculateTotal() {
    return this.stateTotalAreasArray.reduce((total, item) => total + item.totalArea, 0)
  }

  calculateEstate() {
    return this.stateTotalAreasArray.reduce((total, item) => total + item.estateNo, 0)
  }

  calculateRegisteredEstate() {
    return this.stateTotalAreasArray.reduce((total, item) => total + item.registeredEstates, 0)
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }



}
