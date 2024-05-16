import { Component, OnInit } from '@angular/core';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-estate-by-state',
  templateUrl: './estate-by-state.component.html',
  styleUrls: ['./estate-by-state.component.css']
})
export class EstateByStateComponent implements OnInit {

  term = ''
  order = ''
  currentSortedColumn = ''
  year = ''

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
    private reportService:ReportService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString()
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
      const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(
        estates => {
        this.estates = estates;
        this.calculateTotalAllArea();
      });
      this.subscriptionService.add(getAllEstate);
    }, 2000);
  }

  calculateTotalAllArea() {
    this.estates.forEach(estate => {
      const getField = this.reportService.getFieldArea(this.year)
      .subscribe(
        Response => {
        const area = Response.filter(x => x.estateId === estate.id && x.isActive === true && !x.fieldStatus.toLowerCase().includes('abandoned') && !x.fieldStatus.toLowerCase().includes('government') && !x.fieldStatus.toLowerCase().includes('conversion to other crop'));
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
      this.subscriptionService.add(getField);

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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
