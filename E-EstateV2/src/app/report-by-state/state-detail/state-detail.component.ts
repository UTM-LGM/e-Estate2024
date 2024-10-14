import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, tap } from 'rxjs';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';


@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
  styleUrls: ['./state-detail.component.css']
})
export class StateDetailComponent implements OnInit {

  startMonth = ''
  endMonth = ''
  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'rubberArea', displayText: 'Rubber Area (Ha)' },
  ];

  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1
  itemsPerPage = 20
  totalArea = 0

  stateId: any
  estates: any = []

  stateTotalAreas = {} as any;
  stateTotalAreasArray: any[] = []

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private reportService: ReportService,
    private location: Location,

  ) { }

  ngOnInit(): void {
    // Retrieve the query parameters
    this.route.queryParams.subscribe(params => {
      this.startMonth = params['startMonth'];
      this.endMonth = params['endMonth'];
      this.route.params.subscribe(params => {
        this.stateId = params['id'];
      });
      if (this.stateId != null) {
        const getOneState = this.myLesenService.getEstateByStateId(this.stateId)
          .subscribe(
            Response => {
              this.estates = Response
              this.calculateTotalAllArea();
              this.isLoading = false
            }
          )
      }
    });
  }

  // Assuming this is inside your component class
  calculateTotalAllArea() {
    const observables = this.estates.map((estate: any) =>
      this.reportService.getStateFieldArea(this.startMonth, this.endMonth).pipe(
        map((response: any) => ({
          estateName: estate.name,
          estateAdd1: estate.add1,
          estateId:estate.id,
          fields: response.filter((x: any) => x.estateId === estate.id && x.isActive === true &&
            !x.fieldStatus?.toLowerCase().includes('abandoned') &&
            !x.fieldStatus?.toLowerCase().includes('government') &&
            !x.fieldStatus?.toLowerCase().includes('conversion to other crop'))
        })),
      )
    );

    forkJoin(observables).subscribe((results: any) => {
      this.stateTotalAreasArray = this.estates.map((estate: any) => {
        const result = results.find((res: any) => res.estateId === estate.id);
        if (result) {
          const totalArea = result.fields.reduce((acc: any, curr: any) => acc + (curr.area || 0), 0);
          return {
            estateName: estate.name,
            estateAdd1: estate.add1,
            estateLicenseNo : estate.licenseNo,
            totalArea: totalArea,
            state: estate.state
          };
        } else {
          return {
            estateName: estate.name,
            estateAdd1: estate.add1,
            estateLicenseNo : estate.licenseNo,
            totalArea: 0,
            state: estate.state
          };
        }
      });

      this.calculateArea()
      this.isLoading = false;
    });
  }

  calculateArea(){
    this.totalArea = this.stateTotalAreasArray.reduce((acc, worker) => acc + (worker.totalArea || 0), 0)

  }




  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  exportToExcel(data: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData: any = data.map(row => ({
      No: bilCounter++,
      EstateName: row.estateName,
      TotalRubberArea: row.totalArea,
      State:row.state
    }));

    // Add a header row with the start and end month-year values
    const headerRow = [
      { No: 'Start Month Year:', EstateName: this.startMonth },
      { No: 'End Month Year:', EstateName: this.endMonth },
      {}, // Empty row for separation
      { No: 'No', EstateName: 'EstateName', TotalRubberArea: 'TotalRubberArea(Ha)', State: 'State' }
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

  back() {
    this.location.back()
  }


}
