import { Component, OnInit } from '@angular/core';
import { Field } from 'src/app/_interface/field';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';

@Component({
  selector: 'app-rubber-crops-by-state',
  templateUrl: './rubber-crops-by-state.component.html',
  styleUrls: ['./rubber-crops-by-state.component.css']
})
export class RubberCropsByStateComponent implements OnInit {

  term = ''
  order = ''
  isLoading = true
  pageNumber = 1

  estates: any[] = []

  fields: Field[] = []

  fieldsWithEstate: any[] = [];
  estateWithFields: any[] = []

  stateTotals = {} as any;
  stateTotalsArray:any

  constructor(
    private fieldService: FieldService,
    private myLesenService: MyLesenIntegrationService
  ) { }

  ngOnInit(): void {
    this.getFieldInfo()
  }

  getFieldInfo() {
    setTimeout(() => { 
      this.myLesenService.getAllEstate().subscribe(estatesResponse => {
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
                const fields = fieldsResponse.filter(field => field.estateId == estate.id);
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
    }, 2000);
  }   
}
