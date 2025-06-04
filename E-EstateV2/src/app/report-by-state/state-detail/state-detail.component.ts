import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, tap } from 'rxjs';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';
import { FieldService } from 'src/app/_services/field.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';


@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
  styleUrls: ['./state-detail.component.css']
})
export class StateDetailComponent implements OnInit, OnDestroy {

  startDate: any
  endDate: any
  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'licenseNo', displayText: 'License No' },
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
    private fieldService: FieldService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    // Retrieve the query parameters
    this.isLoading = true
    this.route.queryParams.subscribe(params => {
      if (params['startDate']) {
        this.startDate = new Date(params['startDate']);
      }
      if (params['endDate']) {
        this.endDate = new Date(params['endDate']);
      }
      this.route.params.subscribe(params => {
        this.stateId = params['id'];
      });
      if (this.stateId != null) {
        const getOneState = this.myLesenService.getEstateByStateId(this.stateId)
          .subscribe(
            Response => {
              this.estates = Response
              this.calculateTotalAllArea();
            }
          )
        this.subscriptionService.add(getOneState);
      }
    });
  }

  // Assuming this is inside your component class
  calculateTotalAllArea() {
  const observables = this.estates.map((estate: any) =>
    this.fieldService.getFieldByEstateId(estate.id).pipe(
      // tap(response => {
      //   console.log(`Response for estate ${estate.id}:`, response);
      // }),
      map(response => ({
        stateId: estate.stateId,
        estateId: estate.id,
        state: estate.state,
        name: estate.name,
        add1: estate.add1,
        licenseNo: estate.licenseNo,
        fields: response.filter(x => {
          const createdDate = new Date(x.createdDate);
          return (
            x.estateId === estate.id &&
            createdDate >= this.startDate &&
            createdDate <= this.endDate &&
            x.isActive === true &&
            [1, 3, 5, 6].includes(x.fieldStatusId)
          );
        })
      }))
    )
  );

  forkJoin(observables).subscribe((results: any) => {
    this.stateTotalAreasArray = results.map((result: any) => {
      const totalArea = result.fields.reduce((acc: number, curr: any) => acc + (curr.rubberArea || 0), 0);

      return {
        estateName: result.name,
        estateAdd1: result.add1,
        estateLicenseNo: result.licenseNo,
        totalArea: totalArea,
        state: result.state
      };
    });

    this.calculateArea(); // ✅ Moved inside subscribe to ensure data is ready
  });
}


  calculateArea() {
    this.totalArea = this.stateTotalAreasArray.reduce((acc, area) => acc + (area.totalArea || 0), 0)
    this.isLoading = false
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
      EstateLicenseNo: row.estateLicenseNo,
      TotalRubberArea: row.totalArea,
      State: row.state
    }));

    // Add a header row with the start and end month-year values
    const headerRow = [
      { No: 'Start Month Year:', EstateName: this.startDate },
      { No: 'End Month Year:', EstateName: this.endDate },
      {}, // Empty row for separation
      { No: 'No', EstateName: 'EstateName', EstateLicenseNo: 'EstateLicenseNo', TotalRubberArea: 'TotalRubberArea(Ha)', State: 'State' }
    ];

    // Combine the header row with the filtered data
    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Format the filename to include start and end month-year
    const formattedFileName = `${fileName}_${this.startDate}_${this.endDate}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }

  back() {
    this.location.back()
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }



}