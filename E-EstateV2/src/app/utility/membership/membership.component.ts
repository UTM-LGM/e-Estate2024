import { Component, OnDestroy, OnInit } from '@angular/core';
import { MembershipType } from 'src/app/_interface/membership';
import { MembershipService } from 'src/app/_services/membership.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css'],
})
export class MembershipComponent implements OnInit, OnDestroy {
  membershipType: MembershipType = {} as MembershipType

  membershipTypes: MembershipType[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  itemsPerPageMembership = 10

  sortableColumns = [
    { columnName: 'membershipType', displayText: 'Membership Type' },
  ];

  constructor(
    private membershipService: MembershipService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.getMembership()
    this.membershipType.membershipType = ''
  }

  submit() {
    if (this.membershipType.membershipType === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.membershipTypes.some(s => s.membershipType.toLowerCase() === this.membershipType.membershipType.toLowerCase())) {
      swal.fire({
        text: 'Membership Type already exists!',
        icon: 'error'
      });
    }
    else {
      this.membershipType.isActive = true
      this.membershipType.createdBy = this.sharedService.userId.toString()
      this.membershipType.createdDate = new Date()
      this.membershipService.addMembership(this.membershipType)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Membership Type successfully submitted!',
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
    this.membershipType = {} as MembershipType;
  }

  getMembership() {
    setTimeout(() => {
      const getMembership = this.membershipService.getMembership()
        .subscribe(
          Response => {
            this.membershipTypes = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getMembership);

    }, 2000)
  }

  status(membership: MembershipType) {
    membership.updatedBy = this.sharedService.userId.toString()
    membership.updatedDate = new Date()
    membership.isActive = !membership.isActive
    this.membershipService.updateMembership(membership)
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

}
