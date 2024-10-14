import { Component, OnDestroy, OnInit } from '@angular/core';
import { LaborInformation } from 'src/app/_interface/laborInformation';
import { LaborTypeService } from 'src/app/_services/labor-type.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-local-labor-type',
  templateUrl: './local-labor-type.component.html',
  styleUrls: ['./local-labor-type.component.css']
})
export class LaborInformationComponent implements OnInit, OnDestroy {
  labor: LaborInformation = {} as LaborInformation

  labors: LaborInformation[] = []

  term = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  itemsPerPage = 10

  sortableColumns = [
    { columnName: 'laborType', displayText: 'Local Labor Type' },
  ];

  constructor(
    private sharedService: SharedService,
    private laborTypeService: LaborTypeService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getType()
    this.labor.laborType = ''
  }

  submit() {
    if (this.labor.laborType === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.labors.some(s => s.laborType.toLowerCase() === this.labor.laborType.toLowerCase())) {
      swal.fire({
        text: 'Local Labor Type already exists!',
        icon: 'error'
      });
    }
    else {
      this.labor.isActive = true
      this.labor.createdBy = this.sharedService.userId.toString()
      this.labor.createdDate = new Date()
      this.laborTypeService.addType(this.labor)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Local Labor Type successfully submitted!',
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
    this.labor = {} as LaborInformation
  }

  getType() {
    setTimeout(() => {
      const getType = this.laborTypeService.getType()
        .subscribe(
          Response => {
            this.labors = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getType);

    }, 2000)
  }

  status(type: LaborInformation) {
    type.updatedBy = this.sharedService.userId.toString()
    type.updatedDate = new Date()
    type.isActive = !type.isActive
    this.laborTypeService.updateType(type)
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
