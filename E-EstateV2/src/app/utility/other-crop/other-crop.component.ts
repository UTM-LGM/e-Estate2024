import { Component, OnInit } from '@angular/core';
import { OtherCrop } from 'src/app/_interface/otherCrop';
import { OtherCropService } from 'src/app/_services/other-crop.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-other-crop',
  templateUrl: './other-crop.component.html',
  styleUrls: ['./other-crop.component.css']
})
export class OtherCropComponent implements OnInit {

  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  isLoading = true

  otherCrop: OtherCrop = {} as OtherCrop
  otherCrops: OtherCrop[] = []

  sortableColumns = [
    { columnName: 'otherCrop', displayText: 'Other Crop' },
  ];

  constructor(
    private otherCropService: OtherCropService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.otherCrop.otherCrop = ''
    this.getOtherCrop()
  }

  getOtherCrop() {
    setTimeout(() => {
      this.otherCropService.getOtherCrop()
        .subscribe(
          Response => {
            this.otherCrops = Response
            this.isLoading = false
          }
        )
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
}