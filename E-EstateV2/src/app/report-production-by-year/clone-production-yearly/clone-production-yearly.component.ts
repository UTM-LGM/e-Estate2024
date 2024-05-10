import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clone-production-yearly',
  templateUrl: './clone-production-yearly.component.html',
  styleUrls: ['./clone-production-yearly.component.css']
})
export class CloneProductionYearlyComponent implements OnInit {

  role = ''
  year = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  term = ''

  estate: any = {} as any
  companies: any[] = []

  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  company: any = {} as any

  cloneProduction: any[] = []
  cloneAreaData: any = [];

  sortableColumns = [
    { columnName: 'cloneName', displayText: 'Clone Name' },
    { columnName: 'area', displayText: 'Clone Area (Ha)' },
  ];

  constructor(
    private reportService: ReportService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.getProductionYearly()
  }

  companySelected() {
    this.estate.id = 0
  }

  yearSelected() {
    this.cloneAreaData = []
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.getProductionYearly()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
    }
  }

  getProductionYearly() {
    setTimeout(() => {
      if (this.year == '') {
        this.isLoading = false;
        this.cloneProduction = [];
      } else {
        this.reportService.getProductionByClone(this.year)
          .subscribe(
            Response => {
              this.cloneProduction = Response;
              this.isLoading = false;

              // Create a map to store unique cloneName entries and their areas
              const cloneAreaMap = new Map();

              // Iterate through the cloneProduction array
              this.cloneProduction.forEach(field => {
                const { fieldId, area, fieldClone } = field;

                if (fieldClone.length > 1) {
                  // If fieldClone length is greater than 1, sum up the area for 'MixedClone'
                  const mixedCloneName = 'MIXED CLONE';
                  if (cloneAreaMap.has(mixedCloneName)) {
                    // If 'MixedClone' already exists in the map, add area to existing value
                    cloneAreaMap.set(mixedCloneName, cloneAreaMap.get(mixedCloneName) + area);
                  } else {
                    // If 'MixedClone' doesn't exist in the map, add it with current area
                    cloneAreaMap.set(mixedCloneName, area);
                  }
                } else {
                  // If fieldClone length is 1, proceed normally
                  const { cloneId, cloneName } = fieldClone[0];
                  if (cloneAreaMap.has(cloneName)) {
                    // If cloneName already exists in the map, add area to existing value
                    cloneAreaMap.set(cloneName, cloneAreaMap.get(cloneName) + area);
                  } else {
                    // If cloneName doesn't exist in the map, add it with current area
                    cloneAreaMap.set(cloneName, area);
                  }
                }
              });

              // Convert the map to an array of objects
              this.cloneAreaData = [];
              cloneAreaMap.forEach((area, cloneName) => {
                this.cloneAreaData.push({ cloneName: cloneName, area: area });
              });
            }
          );
      }
    }, 2000);
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

}
