import { Component, OnInit } from '@angular/core';
import { FieldStatus } from 'src/app/_interface/fieldStatus';
import { FieldStatusService } from 'src/app/_services/field-status.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crop-category',
  templateUrl: './crop-category.component.html',
  styleUrls: ['./crop-category.component.css'],
})
export class CropCategoryComponent implements OnInit {
  crop = {} as FieldStatus

  cropCategories: FieldStatus[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'fieldStatus', displayText: 'Field Status' },
  ];

  constructor(
    private fieldStatusService: FieldStatusService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getCrop()
    this.crop.isMature = null
  }

  submit() {
    if (this.cropCategories.some(s => s.fieldStatus.toLowerCase() === this.crop.fieldStatus.toLowerCase() && s.isMature == this.crop.isMature)) {
      swal.fire({
        text: 'Field Status already exists!',
        icon: 'error'
      });
    }
    else {
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
      this.fieldStatusService.getFieldStatus()
        .subscribe(
          (Response: any) => {
            this.cropCategories = Response
            this.isLoading = false
          });
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

}
