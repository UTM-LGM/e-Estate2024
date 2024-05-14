import { Component, OnInit } from '@angular/core';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';

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
    { columnName: 'state', displayText: 'State' },
    { columnName: 'estateNo', displayText: 'No of Estate' },
    { columnName: 'rubberArea', displayText: 'Total Rubber Area (Ha)' },
  ];

  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService:ReportService
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
      this.myLesenService.getAllEstate().subscribe(estates => {
        this.estates = estates;
        this.calculateTotalArea();
      });
    }, 2000);
  }

  calculateTotalArea() {
    this.estates.forEach(estate => {
      this.reportService.getFieldArea().subscribe(Response => {
        const area = Response.filter(x => x.estateId === estate.id && x.isActive == true);
        const totalArea = area.reduce((acc, curr) => acc + curr.area, 0);
        // Accumulate the total area for each state
        if (!this.stateTotalAreas[estate.state]) {
          this.stateTotalAreas[estate.state] = { count: 1, totalArea: totalArea };
        } else {
          this.stateTotalAreas[estate.state].count++;
          this.stateTotalAreas[estate.state].totalArea += totalArea;
        }
        this.isLoading = false;
      });
    });
  }

}
