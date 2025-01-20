import { Component, OnDestroy, OnInit } from '@angular/core';
import { Field } from 'src/app/_interface/field';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-rubber-crops-by-state',
  templateUrl: './rubber-crops-by-state.component.html',
  styleUrls: ['./rubber-crops-by-state.component.css']
})
export class RubberCropsByStateComponent implements OnInit, OnDestroy {

  term = ''
  order = ''
  isLoading = true
  pageNumber = 1
  year = ''
  startMonth = ''
  endMonth = ''


  estates: any[] = []

  fields: Field[] = []

  fieldsWithEstate: any[] = [];
  estateWithFields: any[] = []

  stateTotals = {} as any;
  stateTotalsArray: any[] = []

  totalNewPlanting = 0
  totalReplanting = 0
  totalTapped = 0
  totalAbandoned = 0
  totalArea = 0

  constructor(
    private fieldService: FieldService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private reportService:ReportService
  ) { }

  ngOnInit(): void {
    // this.year = new Date().getFullYear().toString()
    this.isLoading = false
  }

  monthChange() {
    this.isLoading = true
    this.stateTotals = {}
    this.stateTotalsArray = []
    this.getFieldInfo()
  }

  chageStartMonth() {
    this.endMonth = ''
    this.stateTotalsArray = []
    this.stateTotals = {}
  }

  getFieldInfo() {
    setTimeout(() => {
      const getAllEstate = this.myLesenService.getAllActiveEstate()
        .subscribe(
          estatesResponse => {
            this.estates = estatesResponse.filter(estate => estate.state); // Filter out estates with null or undefined state

            const promiseArray = this.estates.map(estate => {
              return new Promise<void>(resolve => {
                if (!this.stateTotals[estate.state]) {
                  this.stateTotals[estate.state] = {
                    totalNewPlantingArea: 0,
                    totalReplantingArea: 0,
                    totalTappedArea: 0,
                    totalAbandonedArea: 0
                  };
                }

                if (estate.state) {
                  this.reportService.getStateFieldAreaById(estate.id).subscribe(fieldsResponse => {
                    const startDate = new Date(`${this.startMonth}-01`);
                    const endDate = new Date(`${this.endMonth}`);
                    endDate.setMonth(endDate.getMonth() + 1);
                    endDate.setDate(0); // Sets the date to the last day of the previous month

                    // const fields = fieldsResponse.filter(field => field.estateId == estate.id && field.createdDate >= startDate && field.createdDate < endDate);
                    const filteredFields = fieldsResponse.filter(field => {
                      const fieldCreatedDate = new Date(field.createdDate);
                      return field.estateId === estate.id && fieldCreatedDate >= startDate && fieldCreatedDate <= endDate && field.isActive == true;
                    });
                    if (filteredFields && filteredFields.length > 0) {
                      estate.fields = filteredFields;
                      // Calculate total areas for different statuses
                      const totalAreas = {
                        'new planting': 0,
                        'replanting': 0,
                        'tapped area': 0,
                        'abandoned - untapped': 0
                      } as any;

                      estate.fields.forEach((field: any) => {
                        if (field.isActive) {
                          totalAreas[field.fieldStatus?.toLowerCase()] += field.rubberArea;
                        }
                      });

                      estate.totalAreas = totalAreas;

                      // Update state totals
                      this.stateTotals[estate.state].totalNewPlantingArea += totalAreas['new planting'];
                      this.stateTotals[estate.state].totalReplantingArea += totalAreas['replanting'];
                      this.stateTotals[estate.state].totalTappedArea += totalAreas['tapped area'];
                      this.stateTotals[estate.state].totalAbandonedArea += totalAreas['abandoned - untapped'];
                    }
                    resolve();
                  });
                }
              });
            });

            //wait for all the asynchronous tasks to complete before logging the state totals array
            Promise.all(promiseArray).then(() => {
              this.stateTotalsArray = Object.keys(this.stateTotals).map(state => ({
                state: state,
                totalNewPlantingArea: this.stateTotals[state].totalNewPlantingArea,
                totalReplantingArea: this.stateTotals[state].totalReplantingArea,
                totalTappedArea: this.stateTotals[state].totalTappedArea,
                totalAbandonedArea: this.stateTotals[state].totalAbandonedArea
              }));

              this.calculateArea()

              this.isLoading = false
            });
          });
      this.subscriptionService.add(getAllEstate);

    }, 2000);
  }


  // yearSelected() {
  //   this.estates = []
  //   const yearAsString = this.year.toString();
  //   if (yearAsString.length === 4) {
  //     this.isLoading = true
  //     this.stateTotals = {}
  //     this.getFieldInfo()
  //   } else {
  //     swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Please insert correct year',
  //     });
  //     this.year = ''
  //   }
  // }

  exportToExcel(data: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData:any = data.map(row => ({
      No: bilCounter++,
      State: row.state,
      NewPlanting: row.totalNewPlantingArea,
      Replanting: row.totalReplantingArea,
      TappedArea: row.totalTappedArea,
      Abandoned: row.totalAbandonedArea,
      TotalRubberArea: row.totalNewPlantingArea + row.totalReplantingArea + row.totalTappedArea + row.totalAbandonedArea
    }));

    const headerRow = [
      { No: 'Start Month Year:', State: this.startMonth},
      { No: 'End Month Year:', State: this.endMonth},
      {}, // Empty row for separation
      { No: 'No', State: 'State', NewPlanting: 'NewPlanting', Replanting: 'Replanting', 
        TappedArea: 'TappedArea', Abandoned: 'Abandoned', TotalRubberArea: 'TotalRubberArea'
      }
    ];

    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }


  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  calculateArea(){
    this.totalNewPlanting = this.stateTotalsArray.reduce((total, item) => total + item.totalNewPlantingArea, 0)
    this.totalReplanting =  this.stateTotalsArray.reduce((total, item) => total + item.totalReplantingArea, 0)
    this.totalTapped = this.stateTotalsArray.reduce((total, item) => total + item.totalTappedArea, 0)
    this.totalAbandoned =  this.stateTotalsArray.reduce((total, item) => total + item.totalAbandonedArea, 0)
    this.calculateTotal()
  }

  calculateTotal(){
    this.totalArea = this.totalNewPlanting + this.totalReplanting + this.totalTapped + this.totalAbandoned
   }

   onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

}
