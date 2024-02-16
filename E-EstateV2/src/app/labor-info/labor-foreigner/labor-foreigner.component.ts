import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Country } from 'src/app/_interface/country';
import { ForeignLabor } from 'src/app/_interface/foreignLabor';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';
import { LaborForeignerDetailComponent } from '../labor-foreigner-detail/labor-foreigner-detail.component';
import { AddCountryComponent } from './add-country/add-country.component';
import { CountryService } from 'src/app/_services/country.service';
import { ForeignLaborService } from 'src/app/_services/foreign-labor.service';

@Component({
  selector: 'app-labor-foreigner',
  templateUrl: './labor-foreigner.component.html',
  styleUrls: ['./labor-foreigner.component.css']
})
export class LaborForeignerComponent implements OnInit {

  labor: ForeignLabor = {} as ForeignLabor

  filterCountries: Country[] = []

  filterLabors: ForeignLabor[] = []

  previousMonth = new Date()
  currentDate = new Date()

  isLoading = true
  pageNumber = 1
  totalForeignWorker = 0

  constructor(
    private countryService: CountryService,
    private datePipe: DatePipe,
    private foreignLaborService: ForeignLaborService,
    private sharedService: SharedService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.setNull()
    this.getDate()
    this.getLabor()
    this.getCountry()
  }

  setNull() {
    this.labor.fieldCheckrole = null
    this.labor.fieldContractor = null
    this.labor.tapperCheckrole = null
    this.labor.tapperContractor = null
    this.labor.workerNeeded = null
  }

  getDate() {
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
    this.labor.monthYear = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')!.toUpperCase()
  }

  getCountry() {
    this.labor.countryId = 0
    this.countryService.getCountryAsc()
      .subscribe(
        Response => {
          const countries = Response
          this.filterCountries = countries.filter((e) => e.isActive == true && e.isLocal == false && !this.filterLabors.some(x => x.countryId == e.id))
        });
  }

  futureMonth(): boolean {
    if (!this.labor.monthYear) {
      return false
    }
    const selectedDate = new Date(this.labor.monthYear)
    if (selectedDate.getFullYear() < this.currentDate.getFullYear() ||
      (selectedDate.getFullYear() === this.currentDate.getFullYear() &&
        selectedDate.getMonth() < this.currentDate.getMonth())) {
      return true
    } else {
      return false
    }
  }

  isUpdateDisabled(): boolean {
    if (!this.labor.monthYear) {
      return false
    }
    const selectedDate = new Date(this.labor.monthYear);
    const currentDate = new Date()
    if (
      //condition to check other month not same as current and previous
      !((selectedDate.getFullYear() === currentDate.getFullYear() && selectedDate.getMonth() === currentDate.getMonth()) ||
        (selectedDate.getFullYear() === currentDate.getFullYear() && selectedDate.getMonth() === currentDate.getMonth() - 1)) ||
      //to check if previous month more than 15th
      (currentDate.getDate() <= 15)
    ) {
      return true
    }
    return false
  }

  onSubmit(month: string) {
    this.labor.estateId = this.sharedService.estateId
    this.labor.createdBy = this.sharedService.userId.toString()
    this.labor.createdDate = new Date()
    this.foreignLaborService.addLabor(this.labor)
      .subscribe(
        {
          next: (Response) => {
            swal.fire({
              title: 'Done!',
              text: 'Labor successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset();
            let monthDate = new Date(month)
            this.labor.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy')
            this.getLabor()
            this.labor.countryId = 0
          }, error: (err) => {
            swal.fire({
              text: 'Please fil up the form',
              icon: 'error'
            });
          }
        });
  }

  reset() {
    this.labor = {} as ForeignLabor
  }

  monthSelected(month: string) {
    let monthDate = new Date(month)
    this.labor.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy')!.toUpperCase()
    this.getLabor()
  }

  getLabor() {
    setTimeout(() => {
      this.foreignLaborService.getLabor()
        .subscribe(
          Response => {
            const labors = Response
            this.filterLabors = labors.filter(e => e.monthYear == this.labor.monthYear && e.estateId == this.sharedService.estateId)
            this.getCountry()
            this.sumTable(labors)
            this.TotalForeign()
            this.isLoading = false
          });
    }, 2000)
  }

  sumTable(row: ForeignLabor[]) {
    row.forEach(x => {
      x.total = (x.fieldCheckrole || 0) + (x.fieldContractor || 0) + (x.tapperCheckrole || 0) + (x.tapperContractor || 0)
    });
  }

  TotalForeign() {
    this.totalForeignWorker = this.filterLabors.reduce((acc, item) => acc + item.total, 0)
  }

  delete(id: number) {
    swal.fire({
      title: 'Are you sure to delete ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.foreignLaborService.deleteLabor(id)
            .subscribe(
              Response => {
                swal.fire(
                  'Deleted!',
                  'Labor information has been deleted.',
                  'success'
                ),
                  this.getLabor()
              });
        } else if (result.isDenied) {
        }
      });
  }

  openDialog(labor: ForeignLabor): void {
    const dialogRef = this.dialog.open(LaborForeignerDetailComponent, {
      data: { data: labor },
    })

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getLabor()
        });
  }

  openCountry(): void {
    const dialogRef = this.dialog.open(AddCountryComponent, {})

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getLabor()
        });
  }
}
