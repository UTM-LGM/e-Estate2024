import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldStatus } from 'src/app/_interface/fieldStatus';
import { FieldStatusService } from 'src/app/_services/field-status.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crop-category',
  templateUrl: './crop-category.component.html',
  styleUrls: ['./crop-category.component.css'],
})
export class CropCategoryComponent implements OnInit, OnDestroy {
  crop = {} as FieldStatus

  cropCategories: FieldStatus[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  itemsPerPageStatus = 10

  sortableColumns = [
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'fieldStatus', displayText: 'Field Status' },
  ];

  constructor(
    private fieldStatusService: FieldStatusService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    this.getCrop()
    this.crop.isMature = null
  }

  submit() {
    if (this.cropCategories.some(s => s.fieldStatus?.toLowerCase() === this.crop.fieldStatus?.toLowerCase() && s.isMature == this.crop.isMature)) {
      swal.fire({
        text: 'Field Status already exists!',
        icon: 'error'
      });
    }
    else {
      this.spinnerService.requestStarted()
      this.crop.isActive = true
      this.crop.createdBy = this.sharedService.userId.toString()
      this.crop.createdDate = new Date()
      this.fieldStatusService.addFieldStatus(this.crop)
        .subscribe(
          {
            next: (Response) => {
              swal.fire({
                title: 'Done!',
                text: 'Field Status successfully submitted!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
              this.reset()
              this.ngOnInit()
              this.spinnerService.requestEnded()
            },
            error: (err) => {
              swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill up the form',
              });
            }
          })
    }
  }

  reset() {
    this.crop = {} as FieldStatus
  }

  getCrop() {
    setTimeout(() => {
      const getFieldStatus = this.fieldStatusService.getFieldStatus()
        .subscribe(
          (Response: any) => {
            this.cropCategories = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getFieldStatus);

    }, 2000)
  }

  status(crop: FieldStatus) {
    crop.updatedBy = this.sharedService.userId.toString()
    crop.updatedDate = new Date()
    crop.isActive = !crop.isActive
    this.fieldStatusService.updateFieldStatus(crop)
      .subscribe(
        (Response: any) => {
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

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

}
