import { Component, OnInit } from '@angular/core';
import { Clone } from 'src/app/_interface/clone';
import { CloneService } from 'src/app/_services/clone.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clone',
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.css'],
})
export class CloneComponent implements OnInit {
  clone: Clone = {} as Clone

  clones: Clone[] = []

  isLoading = true
  pageNumber = 1
  term = ''
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'cloneName', displayText: 'Clone Name' },
  ];

  constructor(
    private cloneService: CloneService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getClone()
    this.clone.cloneName = ''
  }

  submit() {
    if (this.clone.cloneName === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.clones.some(s => s.cloneName.toLowerCase() === this.clone.cloneName.toLowerCase())) {
      swal.fire({
        text: 'Clone already exists!',
        icon: 'error'
      });
    }
    else {
      this.clone.isActive = true
      this.clone.createdBy = this.sharedService.userId.toString()
      this.clone.createdDate = new Date()
      this.cloneService.addClone(this.clone)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Clone successfully submitted!',
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
    this.clone = {} as Clone
  }

  getClone() {
    setTimeout(() => {
      this.cloneService.getClone()
        .subscribe(
          Response => {
            this.clones = Response
            this.isLoading = false
          });
    }, 2000)
  }

  status(clone: Clone) {
    clone.updatedBy = this.sharedService.userId.toString()
    clone.updatedDate = new Date()
    clone.isActive = !clone.isActive
    this.cloneService.updateClone(clone)
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

}
