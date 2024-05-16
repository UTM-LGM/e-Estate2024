import { Component, OnInit } from '@angular/core';
import { Ownership } from 'src/app/_interface/ownership';
import { OwnershipService } from 'src/app/_services/ownership.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent implements OnInit {

  ownership: Ownership = {} as Ownership
  ownerships: Ownership[] = []

  isLoading = true
  term = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1


  sortableColumns = [
    { columnName: 'ownership', displayText: 'Ownership Name' },
  ];


  constructor(
    private ownershipService: OwnershipService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit(): void {
    this.ownership.ownership = ''
    this.getOwnership()
  }

  getOwnership() {
    setTimeout(() => {
      const getOwnership = this.ownershipService.getOwnership()
        .subscribe(
          Response => {
            this.ownerships = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getOwnership);

    }, 2000)
  }

  submit() {
    if (this.ownership.ownership === '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.ownerships.some(s => s.ownership.toLowerCase() === this.ownership.ownership.toLowerCase())) {
      swal.fire({
        text: 'Ownership already exists!',
        icon: 'error'
      });
    } else {
      this.ownership.isActive = true
      this.ownership.createdBy = this.sharedService.userId.toString()
      this.ownership.createdDate = new Date()
      this.ownershipService.addOwnership(this.ownership)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Ownership successfully submitted!',
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
    this.ownership = {} as Ownership
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  status(ownership: Ownership) {
    ownership.updatedBy = this.sharedService.userId.toString()
    ownership.updatedDate = new Date()
    ownership.isActive = !ownership.isActive
    this.ownershipService.updateOwnership(ownership)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Ownership successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      );
  }
  
  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}

