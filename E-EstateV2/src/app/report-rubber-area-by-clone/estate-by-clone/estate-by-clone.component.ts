import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloneService } from 'src/app/_services/clone.service';
import { Location } from '@angular/common';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { ReportService } from 'src/app/_services/report.service';
import { FieldService } from 'src/app/_services/field.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-estate-by-clone',
  templateUrl: './estate-by-clone.component.html',
  styleUrls: ['./estate-by-clone.component.css']
})
export class EstateByCloneComponent implements OnInit, OnDestroy {

  cloneId = ''
  startMonth = ''
  endMonth = ''
  clone: any[] = []
  order = ''
  currentSortedColumn = ''
  isLoading = true
  cloneArea: any[] = []
  fieldRubberArea = 0
  cloneDetailsArray: any[] = []
  cloneName = ''

  totalArea = 0
  pageNumber = 1
  itemsPerPage = 10


  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'rubberArea', displayText: 'Rubber Area (Ha)' },
  ];

  constructor(private route: ActivatedRoute,
    private cloneService: CloneService,
    private location: Location,
    private subscriptionService: SubscriptionService,
    private reportService: ReportService,
    private fieldService: FieldService,
    private myLesenService: MyLesenIntegrationService

  ) { }

  ngOnInit(): void {
    // Retrieve the query parameters
    this.route.queryParams.subscribe(params => {
      this.cloneId = params['id'];
      this.startMonth = params['startMonth'];
      this.endMonth = params['endMonth'];
      if (this.cloneId != null) {
        const getCloneName = this.cloneService.getClone()
          .subscribe(
            Response => {
              this.clone = Response.filter(e => e.id == parseInt(this.cloneId))
              this.getFieldCloneArea()
            }
          )
        this.subscriptionService.add(getCloneName);
      }
      else if (this.cloneId == undefined) {
        this.cloneName = 'Mixed Clone'
        this.getFieldCloneArea()
      }
    });
  }

  getFieldCloneArea() {
    setTimeout(() => {
      const getArea = this.reportService.getAreaByAllClone(this.startMonth, this.endMonth)
        .subscribe(
          Response => {
            if (this.cloneId != undefined) {
              this.cloneArea = Response.filter(e => e.cloneIds == this.cloneId)

            } else {
              this.cloneArea = Response.filter(e => e.cloneIds.length > 1)
            }
            let requests = this.cloneArea.map(clone =>
              this.fieldService.getOneField(clone.fieldId).pipe(
                switchMap(fieldResponse => {
                  if (fieldResponse.rubberArea != null) {
                    let cloneDetail = {
                      rubberArea: fieldResponse.rubberArea,
                      estateId: fieldResponse.estateId,
                      estateName: '',  // Placeholder for estateName,
                      estateLicense: '',
                      fieldName: fieldResponse.fieldName
                    };

                    // Fetch estate name
                    return this.myLesenService.getOneEstate(cloneDetail.estateId).pipe(
                      map(estateNameResponse => {
                        cloneDetail.estateName = estateNameResponse.name;
                        cloneDetail.estateLicense = estateNameResponse.licenseNo
                        return cloneDetail;
                      })
                    );
                  }
                  return of(null); // Return null if rubberArea is null
                })
              )
            );

            forkJoin(requests).subscribe(cloneDetails => {
              // Filter out any null values
              this.cloneDetailsArray = cloneDetails.filter(detail => detail !== null);
              this.calculateArea()
              this.isLoading = false;
            });
          }
        );

      this.subscriptionService.add(getArea);
    }, 2000);
  }

  calculateArea() {
    this.totalArea = this.cloneDetailsArray.reduce((acc, worker) => acc + (worker.rubberArea || 0), 0)
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  back() {
    this.location.back()
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  exportToExcel(data: any[], fileName: string) {
    if (this.cloneId == undefined) {
      let bilCounter = 1
      const filteredData: any = data.map(row => ({
        No: bilCounter++,
        EstateName: row.estateName + ' (' + row.estateLicense + ') ' + ' - ' + row.fieldName,
        TotalRubberArea: row.rubberArea,
        CloneName: this.cloneName
      }))

      const headerRow = [
        { No: 'Start Month Year:', EstateName: this.startMonth },
        { No: 'End Month Year:', EstateName: this.endMonth },
        {}, // Empty row for separation
        { No: 'No', EstateName: 'EstateName', TotalRubberArea: 'TotalRubberArea(Ha)', CloneName: 'CloneName' }
      ];

      const exportData = headerRow.concat(filteredData);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Format the filename to include start and end month-year
      const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

      XLSX.writeFile(wb, formattedFileName);
    }
    else{
      let bilCounter = 1
      const filteredData: any = data.map(row => ({
        No: bilCounter++,
        EstateName: row.estateName + ' (' + row.estateLicense + ') ' + ' - ' + row.fieldName,
        TotalRubberArea: row.rubberArea,
        CloneName: this.clone[0]?.cloneName
      }))

      const headerRow = [
        { No: 'Start Month Year:', EstateName: this.startMonth },
        { No: 'End Month Year:', EstateName: this.endMonth },
        {}, // Empty row for separation
        { No: 'No', EstateName: 'EstateName', TotalRubberArea: 'TotalRubberArea(Ha)', CloneName: 'CloneName' }
      ];

      const exportData = headerRow.concat(filteredData);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Format the filename to include start and end month-year
      const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

      XLSX.writeFile(wb, formattedFileName);
    }
  }



}
