import { Component } from '@angular/core';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { forkJoin, map, switchMap } from 'rxjs';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';


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
    const observables = this.filteredEstates.map(estate =>
      this.fieldProductionService.getProduction().pipe(
        map((response: any) => ({
          estateId: estate.id,
          state: estate.state,
          production: response.filter((x: any) => {
            if (!x.monthYear) return false; // Ensure monthYear exists before splitting

            const yearFromMonthYear = x.monthYear.split('-')[1]; // Extract year from 'MAY-2024'

            return x.estateId === estate.id &&
              x.status === "SUBMITTED" &&
              yearFromMonthYear === this.year.toString();
          })
        })),
        switchMap(estateData => {
          // Fetch the premise for the estateId
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
      // Initialize the estateTotalProduction object to store totals per estate
      this.estateTotalProduction = {};

      results.forEach(result => {
        // Calculate total cuplump production for each estateId
        const totalCuplumpProduction = result.production.reduce((acc: number, curr: { cuplump: number, cuplumpDRC: number }) => {
          return acc + (curr.cuplump * (curr.cuplumpDRC / 100));
        }, 0);

        // Calculate total latex production for each estateId
        const totalLatexProduction = result.production.reduce((acc: number, curr: { latex: number, latexDRC: number }) => {
          return acc + (curr.latex * (curr.latexDRC / 100));
        }, 0);

        // Initialize if estateId does not exist in the total production object
        if (!this.estateTotalProduction[result.estateId]) {
          this.estateTotalProduction[result.estateId] = {
            estateId: result.estateId,  // Store the estateId
            state: result.state,        // Store the state
            premise: result.premise,    // Store the premise data
            totalCuplumpProduction: 0,
            totalLatexProduction: 0
          };
        }

        // Add the calculated totals for cuplump and latex production to the corresponding estate
        this.estateTotalProduction[result.estateId].totalCuplumpProduction += totalCuplumpProduction;
        this.estateTotalProduction[result.estateId].totalLatexProduction += totalLatexProduction;
      });

      // Convert the estateTotalProduction object to an array
      this.estateTotalProductionArray = Object.keys(this.estateTotalProduction).map(key => ({
        estateId: this.estateTotalProduction[key].estateId,  // Include estateId
        state: this.estateTotalProduction[key].state,        // Include state
        premise: this.estateTotalProduction[key].premise,    // Include premise
        cuplumpProduction: this.estateTotalProduction[key].totalCuplumpProduction,
        latexProduction: this.estateTotalProduction[key].totalLatexProduction,
        totalProduction: this.estateTotalProduction[key].totalCuplumpProduction + this.estateTotalProduction[key].totalLatexProduction
      }));

      const totalProductionSum = this.estateTotalProductionArray.reduce((acc, curr) => acc + curr.totalProduction, 0);

      // If you need to store this sum somewhere in your object
      this.total = totalProductionSum;

      this.isLoading = false

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
      CuplumpProduction: row.cuplumpProduction,
      LatexProduction: row.latexProduction,
      TotalProduction: row.totalProduction
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
