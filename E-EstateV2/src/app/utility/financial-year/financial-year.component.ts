import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinancialYear } from 'src/app/_interface/financialYear';
import { FinancialYearService } from 'src/app/_services/financial-year.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.css'],
})
export class FinancialYearComponent implements OnInit, OnDestroy {
  financialYear: FinancialYear = {} as FinancialYear

  financialYears: FinancialYear[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'financialYear', displayText: 'Financial Year' },
  ];

  constructor(
    private financialYearService: FinancialYearService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getFinancialYear()
    this.financialYear.financialYear = ''
  }

  submit() {
    if (this.financialYear.financialYear === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.financialYears.some(s => s.financialYear.toLowerCase() === this.financialYear.financialYear.toLowerCase())) {
      swal.fire({
        text: 'Financial Year already exists!',
        icon: 'error'
      });
    }
    else {
      this.financialYear.isActive = true
      this.financialYear.createdBy = this.sharedService.userId.toString()
      this.financialYear.createdDate = new Date()
      this.financialYearService.addFinancialYear(this.financialYear)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Financial Year successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          });
    }

  }

  reset() {
    this.financialYear = {} as FinancialYear
  }

  getFinancialYear() {
    setTimeout(() => {
      const getFinanacialYear = this.financialYearService.getFinancialYear()
        .subscribe(
          Response => {
            this.financialYears = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getFinanacialYear);

    }, 2000)
  }

  status(year: FinancialYear) {
    year.updatedBy = this.sharedService.userId.toString()
    year.updatedDate = new Date()
    year.isActive = !year.isActive
    this.financialYearService.updateYear(year)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      );
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
