import { Component, OnDestroy, OnInit } from '@angular/core';
import { Field } from 'src/app/_interface/field';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
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


  estates: any[] = []

  fields: Field[] = []

  fieldsWithEstate: any[] = [];
  estateWithFields: any[] = []

  stateTotals = {} as any;
  stateTotalsArray:any

  constructor(
    private fieldService: FieldService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString()
    this.getFieldInfo()
  }

  getFieldInfo() {
    setTimeout(() => { 
      const getAllEstate = this.myLesenService.getAllEstate()
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
              this.fieldService.getField().subscribe(fieldsResponse => {
                const fields = fieldsResponse.filter(field => field.estateId == estate.id && new Date(field.createdDate).getFullYear().toString() === this.year);
                if (fields.length > 0) {
                  estate.fields = fields;                
                  // Calculate total areas for different statuses
                  const totalAreas = {
                    'new planting': 0,
                    'replanting': 0,
                    'tapped area': 0,
                    'abandoned': 0
                  } as any;
    
                  estate.fields.forEach((field:any) => {
                    if (field.isActive) {
                      totalAreas[field.fieldStatus.toLowerCase()] += field.area;
                      if (field.fieldStatus.toLowerCase().includes('abandoned')) {
                        totalAreas['abandoned'] += field.area;
                      }
                    }
                  });
    
                  estate.totalAreas = totalAreas;
    
                  // Update state totals
                  this.stateTotals[estate.state].totalNewPlantingArea += totalAreas['new planting'];
                  this.stateTotals[estate.state].totalReplantingArea += totalAreas['replanting'];
                  this.stateTotals[estate.state].totalTappedArea += totalAreas['tapped area'];
                  this.stateTotals[estate.state].totalAbandonedArea += totalAreas['abandoned'];
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

          this.isLoading = false
        });
      });
      this.subscriptionService.add(getAllEstate);

    }, 2000);
}


  yearSelected() {
    this.estates = []
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.stateTotals = {}
      this.getFieldInfo()
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
    const filteredData = data.map(row => ({
      No: bilCounter++,
      State: row.state,
      NewPlanting: row.totalNewPlantingArea,
      Replanting: row.totalReplantingArea,
      TappedArea: row.totalTappedArea,
      Abandoned: row.totalAbandonedArea,
      TotalRubberArea: row.totalNewPlantingArea + row.totalReplantingArea + row.totalTappedArea
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.year );
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
