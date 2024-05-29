import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { Country } from 'src/app/_interface/country';
import { LaborByCategory } from 'src/app/_interface/laborCategory';
import { LaborInfo } from 'src/app/_interface/laborInfo';
import { LaborInformation } from 'src/app/_interface/laborInformation';
import { CountryService } from 'src/app/_services/country.service';
import { LaborInfoService } from 'src/app/_services/labor-info.service';
import { LaborTypeService } from 'src/app/_services/labor-type.service';
import { SharedService } from 'src/app/_services/shared.service';
import { AddCountryComponent } from 'src/app/labor-info/labor-foreigner/add-country/add-country.component';
import swal from 'sweetalert2';
import { LaborInfoMonthlyDetailComponent } from '../labor-info-monthly-detail/labor-info-monthly-detail.component';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-labor-info-monthly',
  templateUrl: './labor-info-monthly.component.html',
  styleUrls: ['./labor-info-monthly.component.css']
})
export class LaborInfoMonthlyComponent implements OnInit, OnDestroy {

  @Output() backTabEvent = new EventEmitter<void>();
  @Output() nextTabEvent = new EventEmitter<void>();
  previousMonth = new Date()
  filterCountries: Country[] = []
  labor: LaborInfo = {} as LaborInfo
  filterLabors: LaborInfo[] = []
  laborCategory: any = {} as LaborByCategory

  laborCategories: any = {} as any

  filterTypes: LaborInformation[] = []
  isLoading = true
  pageNumber = 1
  totalForeignWorker = 0
  date: any

  laborCategoryArray: LaborByCategory[] = []

  constructor(
    private countryService: CountryService,
    private dialog: MatDialog,
    private laborTypeService: LaborTypeService,
    private sharedService: SharedService,
    private laborInfoService: LaborInfoService,
    private datePipe: DatePipe,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    // this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
    this.getDate()
    this.getCountry()
    this.getLaborType()
    this.getLabor()
  }

  getDate() {
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
    this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
  }

  monthSelected(month: string) {
    let monthDate = new Date(month)
    this.date = this.datePipe.transform(monthDate, 'MMM-yyyy')
    this.getLabor()
  }

  getLaborType() {
    const getType = this.laborTypeService.getType()
      .subscribe(
        Response => {
          const types = Response
          this.filterTypes = types.filter(x => x.isActive == true)
          this.filterTypes.forEach(type => {
            this.laborCategory[type.id] = { noOfWorker: null, };
          });
        }
      )
      this.subscriptionService.add(getType);

  }

  back() {
    this.backTabEvent.emit();

  }

  getCountry() {
    this.labor.countryId = 0
    const getCountry = this.countryService.getCountryAsc()
      .subscribe(
        Response => {
          const countries = Response
          this.filterCountries = countries.filter((e) => e.isActive == true && !this.filterLabors.some(x => x.countryId == e.id))
        });
      this.subscriptionService.add(getCountry);

  }

  openCountry(): void {
    const dialogRef = this.dialog.open(AddCountryComponent, {})

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getLabor()
        });
  }

  onSubmit() {
    // this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    this.labor.monthYear = this.date
    this.labor.estateId = this.sharedService.estateId
    this.labor.createdBy = this.sharedService.userId.toString()
    this.labor.createdDate = new Date()
    this.labor.monthYear = this.date
    this.laborInfoService.addLabor(this.labor)
      .subscribe(
        {
          next: (Response) => {
            this.filterTypes.forEach(type => {
              this.laborCategory[type.id] = {
                noOfWorker: this.laborCategory[type.id].noOfWorker, laborTypeId: type.id, laborInfoId: Response.id,
                createdBy: this.sharedService.userId, createdDate: new Date()
              };
            });
            this.laborCategoryArray = Object.values(this.laborCategory);
            this.laborInfoService.addLaborCategory(this.laborCategoryArray)
              .subscribe(
                Response => {
                  swal.fire({
                    title: 'Done!',
                    text: 'Labor successfully submitted!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                  });
                }
              )
            this.labor.countryId = 0
            this.labor = {} as LaborInfo
            this.getLabor()
            this.getLaborType()
          }, error: (err) => {
            swal.fire({
              text: 'Please fil up the form',
              icon: 'error'
            });
          }
        });
  }

  getLabor() {
    // this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    setTimeout(() => {
      const getLabor = this.laborInfoService.getLabor()
        .subscribe(
          Response => {
            const labors = Response
            this.filterLabors = labors.filter(e => e.monthYear == this.date.toUpperCase() && e.estateId == this.sharedService.estateId)
            this.getCountry()
            this.sumTable(this.filterLabors)
            this.TotalForeign()
            this.isLoading = false
          });
    this.subscriptionService.add(getLabor);

    }, 2000)

  }

  sumTable(row: LaborInfo[]) {
    row.forEach(x => {
      let laborCategorySum = x.laborCategory.reduce((acc, x) => acc + x.noOfWorker, 0)
      x.total = (x.fieldCheckrole || 0) + (x.fieldContractor || 0) + (x.tapperCheckrole || 0) + (x.tapperContractor || 0) + laborCategorySum
    });
  }

  TotalForeign() {
    this.totalForeignWorker = this.filterLabors.reduce((acc, item) => acc + item.total, 0)
  }

  openDialog(labor: LaborInfo): void {
    const dialogRef = this.dialog.open(LaborInfoMonthlyDetailComponent, {
      data: { data: labor },
    })

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getLabor()
        });
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
          this.laborInfoService.deleteLabor(id)
            .subscribe(
              Response => {
                swal.fire(
                  'Deleted!',
                  'Labor information has been deleted.',
                  'success'
                )
                this.getLabor()
              }
            )
        } else if (result.isDenied) {
        }
      });
  }

  nextTab() {
    this.nextTabEvent.emit();
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}