import { Component, OnDestroy, OnInit } from '@angular/core';
import { OtherCrop } from 'src/app/_interface/otherCrop';
import { OtherCropService } from 'src/app/_services/other-crop.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-other-crop',
  templateUrl: './other-crop.component.html',
  styleUrls: ['./other-crop.component.css']
})
export class OtherCropComponent implements OnInit, OnDestroy {

  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  isLoading = true

  itemsPerPageOther = 10

  otherCrop: OtherCrop = {} as OtherCrop
  otherCrops: OtherCrop[] = []

  sortableColumns = [
    { columnName: 'otherCrop', displayText: 'Other Crop' },
  ];

  constructor(
    private otherCropService: OtherCropService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.otherCrop.otherCrop = ''
    this.getOtherCrop()
  }

  getOtherCrop() {
    setTimeout(() => {
      const getOtherCrop = this.otherCropService.getOtherCrop()
        .subscribe(
          Response => {
            this.otherCrops = Response
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getOtherCrop);

    })
  }

  submit() {
    if (this.otherCrop.otherCrop === '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.otherCrops.some(p => p.otherCrop.toLowerCase() === this.otherCrop.otherCrop.toLowerCase())) {
      swal.fire({
        text: 'Other crop already exists!',
        icon: 'error'
      });
    } else {
      this.spinnerService.requestStarted()
      this.otherCrop.isActive = true
      this.otherCrop.createdBy = this.sharedService.userId.toString()
      this.otherCrop.createdDate = new Date()
      this.otherCropService.addOtherCrop(this.otherCrop)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Other Crop successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
            this.spinnerService.requestEnded()
          }
        )

    }
  }

  reset() {
    this.otherCrop = {} as OtherCrop
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  status(otherCrop: OtherCrop) {
    otherCrop.updatedBy = this.sharedService.userId
    otherCrop.updatedDate = new Date()
    otherCrop.isActive = !otherCrop.isActive
    this.otherCropService.updateOtherCrop(otherCrop)
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
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }
  
}
