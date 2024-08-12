import { Component, OnDestroy, OnInit } from '@angular/core';
import { Country } from 'src/app/_interface/country';
import { CountryService } from 'src/app/_services/country.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit, OnDestroy {
  country: Country = {} as Country

  countries: Country[] = []

  term = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  itemsPerPage = 10

  sortableColumns = [
    { columnName: 'isLocal', displayText: 'Origin' },
    { columnName: 'country', displayText: 'Country Name' },
  ];

  constructor(
    private countryService: CountryService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getCountry()
    this.country.country = ''
  }

  onSubmit() {
    if (this.country.country === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.countries.some(s => s.country.toLowerCase() === this.country.country.toLowerCase())) {
      swal.fire({
        text: 'Country already exists!',
        icon: 'error'
      });
    }
    else {
      if (this.country.country.toLowerCase() === 'malaysia') {
        this.country.isLocal = true
      }
      else {
        this.country.isLocal = false
      }
      this.country.isActive = true
      this.country.createdBy = this.sharedService.userId.toString()
      this.country.createdDate = new Date()
      this.countryService.addCountry(this.country)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Country successfully submitted!',
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
    this.country = {} as Country;
  }

  getCountry() {
    setTimeout(() => {
      const getCountry = this.countryService.getCountry()
        .subscribe(
          Response => {
            this.countries = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getCountry);

    }, 2000)
  }

  status(country: Country) {
    country.updatedBy = this.sharedService.userId
    country.updatedDate = new Date()
    country.isActive = !country.isActive
    this.countryService.updateCountry(country)
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

  calculateIndex(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }

  onPageChange(newPageNumber: number) {
    if (newPageNumber < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = newPageNumber;
    }
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }


}
