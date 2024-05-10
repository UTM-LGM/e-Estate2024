import { Component, OnInit } from '@angular/core';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';

@Component({
  selector: 'app-estate-by-state',
  templateUrl: './estate-by-state.component.html',
  styleUrls: ['./estate-by-state.component.css']
})
export class EstateByStateComponent implements OnInit {

  term = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  isLoading = true
  estates: any[] = []
  stateTotalAreas = {} as any;

  sortableColumns = [
    { columnName: 'estateNo', displayText: 'No of estate' },
    { columnName: 'state', displayText: 'State' },
    { columnName: 'rubberArea', displayText: 'Total Rubber Area (Ha)' },
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService
  ) { }

  ngOnInit(): void {
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
      this.myLesenService.getAllEstate()
        .subscribe(
          Response => {
            this.estates = Response;
            this.estates.forEach(estate => {
              if (estate.state) { // Check if estate.state is not null or undefined
                if (estate.state in this.stateTotalAreas) {
                  // Increment count of estates with area
                  this.stateTotalAreas[estate.state].count++;
                  // Accumulate total area
                  if (!isNaN(estate.area)) { // Check if estate.area is a valid number
                    this.stateTotalAreas[estate.state].totalArea += estate.area;
                  }
                } else {
                  // Initialize count and total area
                  if (!isNaN(estate.area) && estate.area > 0) {
                    this.stateTotalAreas[estate.state] = {
                      count: 1,
                      totalArea: estate.area
                    };
                  } else {
                    this.stateTotalAreas[estate.state] = {
                      count: 0,
                      totalArea: 0
                    };
                  }
                }
              }
            });
            this.isLoading = false;
          }
        );
    }, 2000);
  }
}
