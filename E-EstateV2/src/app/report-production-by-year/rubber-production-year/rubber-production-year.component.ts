import { Component } from '@angular/core';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { ReportService } from 'src/app/_services/report.service';


@Component({
  selector: 'app-rubber-production-year',
  templateUrl: './rubber-production-year.component.html',
  styleUrls: ['./rubber-production-year.component.css']
})
export class RubberProductionYearComponent {

  isLoading = true
  role = ''
  year = ''
  stateId = 0
  total = 0

  term = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  itemperpage = 10


  totalCuplumpDry = 0
  totalLatexDry = 0
  totalAllDry = 0


  state: any[] = []
  estates: any[] = []
  filteredEstates: any[] = []

  estateTotalProductionArray: any[] = []
  estateTotalProduction = {} as any;

  sortableColumns = [
    { columnName: 'state', displayText: 'State' },
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'licenseNo', displayText: 'License No' },
    { columnName: 'cuplumpProduction', displayText: 'Cuplump Production Dry(Kg)' },
    { columnName: 'latexProduction', displayText: 'Latex Production Dry(Kg)' },
    { columnName: 'totalProduction', displayText: 'Total Production Dry(Kg)' },
  ];

  constructor(
    private sharedService: SharedService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private fieldProductionService: FieldProductionService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.getState()
  }

  changeState() {
    this.year = ''
    this.total = 0
    this.estateTotalProductionArray = []
  }

  yearSelected() {
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true
      this.filteredEstates = this.estates.filter(x => x.stateId == this.stateId)
      this.total = 0
      this.estateTotalProductionArray = []
      this.calculateTotalProduction()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = ''
    }

  }

  getState() {
    setTimeout(() => {
      const getAllEstate = this.myLesenService.getAllActiveEstate()
        .subscribe(estates => {
          this.estates = estates
          // Create a Set to get distinct states
          const uniqueStates = Array.from(new Set(estates.map((estate: any) => estate.state)))
            .map(state => {
              // Return an object containing the unique state and its corresponding stateId(s)
              return {
                state: state,
                stateId: estates.find((estate: any) => estate.state === state).stateId
              };
            });

          this.state = uniqueStates; // Assign the unique states to estates
          this.isLoading = false
        });
      this.subscriptionService.add(getAllEstate);
    }, 2000);
  }



  calculateTotalProduction() {
    // Map through filtered estates to create observables
    const observables = this.filteredEstates.map(estate =>
      // Use reportService to fetch production yearly data for the current year and estate
      this.reportService.getProductionYearly(this.year).pipe(
        map((response: any[]) => ({
          estateId: estate.id,
          state: estate.state,
          production: response.filter(item => item.estateId === estate.id) // Filter production data for current estate
        })),
        switchMap(estateData => {
          // Fetch premise data for the estate
          return this.myLesenService.getOneEstate(estateData.estateId).pipe(
            map(premise => ({
              ...estateData,
              premise
            }))
          );
        })
      )
    );

    // Combine all observables
    forkJoin(observables).subscribe(results => {
      // Initialize estateTotalProduction object to store totals per estate
      this.estateTotalProduction = {};

      results.forEach(result => {
        // Calculate individual totals per estate
        const totalCuplumpDry = result.production.reduce((total, item) => total + (item.cuplumpDry || 0), 0);
        const totalLatexDry = result.production.reduce((total, item) => total + (item.latexDry || 0), 0);
        const totalAllDry = result.production.reduce((total, item) =>
          total + (item.cuplumpDry || 0) + (item.latexDry || 0) + (item.ussDry || 0) + (item.othersDry || 0), 0
        );

        // Store in the estateTotalProduction object
        this.estateTotalProduction[result.estateId] = {
          estateId: result.estateId,
          state: result.state,
          premise: result.premise,
          totalCuplumpDry: totalCuplumpDry,
          totalLatexDry: totalLatexDry,
          totalAllDry: totalAllDry
        };
      });

      // Convert estateTotalProduction object to an array
      this.estateTotalProductionArray = Object.keys(this.estateTotalProduction).map(key => ({
        estateId: this.estateTotalProduction[key].estateId,
        state: this.estateTotalProduction[key].state,
        premise: this.estateTotalProduction[key].premise,
        totalCuplumpDry: this.estateTotalProduction[key].totalCuplumpDry,
        totalLatexDry: this.estateTotalProduction[key].totalLatexDry,
        totalAllDry: this.estateTotalProduction[key].totalAllDry
      }));

      this.total = this.estateTotalProductionArray.reduce((acc, curr) =>
        acc + curr.totalAllDry, 0
      );

      // Store total of all dry productions
      // total = totalCuplumpDrySum

      // Set loading state to false
      this.isLoading = false;
    });
  }


  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }


  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }


  exportToExcel(data: any[], fileName: string) {
    let bilCounter = 1
    const selectedState = this.state.find(s => s.stateId === this.stateId)?.state || 'All States';

    const filteredData: any = data.map(row => ({
      No: bilCounter++,
      State: row.state,
      EstateName: row.premise.name,
      LicenseNo: row.premise.licenseNo,
      CuplumpProduction: row.totalCuplumpDry,
      LatexProduction: row.totalLatexDry,
      TotalProduction: row.totalAllDry
    }))

    const headerRow = [
      { No: 'Year:', State: this.year },
      { No: 'State:', State: selectedState },
      {}, // Empty row for separation
      { No: 'No', State: 'State', EstateName: 'EstateName', LicenseNo: 'LicenseNo', CuplumpProduction: 'CuplumpProductionDry(Kg)', LatexProduction: 'LatexProductionDry(Kg)', TotalProduction: 'TotalProduction(Kg)' }
    ];

    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const formattedFileName = `${fileName}_${this.year}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }




}
