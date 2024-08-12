import { Component, OnDestroy, OnInit } from '@angular/core';
import { Seller } from 'src/app/_interface/seller';
import { SellerService } from 'src/app/_services/seller.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register-seller',
  templateUrl: './register-seller.component.html',
  styleUrls: ['./register-seller.component.css']
})
export class RegisterSellerComponent implements OnInit, OnDestroy {
  seller: Seller = {} as Seller
  sellers: Seller[] = []

  term = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'licenseNo', displayText: 'Lisence No' },
    { columnName: 'sellerName', displayText: 'Seller Name' },
  ];

  constructor(
    private sharedService: SharedService,
    private sellerService: SellerService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getSeller()
    this.seller.licenseNo = ''
  }

  submit() {
    if (this.seller.licenseNo === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.sellers.some(s => s.sellerName.toLowerCase() === this.seller.sellerName.toLowerCase())) {
      swal.fire({
        text: 'Seller name already exists!',
        icon: 'error'
      });
    }
    else {
      this.seller.isActive = true
      this.seller.createdBy = this.sharedService.userId.toString()
      this.seller.createdDate = new Date()
      this.seller.estateId = this.sharedService.estateId
      this.sellerService.addSeller(this.seller)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Seller successfully submitted!',
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
    this.seller = {} as Seller
  }

  getSeller() {
    setTimeout(() => {
      const getSeller = this.sellerService.getSeller()
        .subscribe(
          Response => {
            this.sellers = Response
            this.isLoading = false
          })
      this.subscriptionService.add(getSeller);
    }, 2000)
  }

  status(seller: Seller) {
    seller.updatedBy = this.sharedService.userId.toString()
    seller.updatedDate = new Date()
    seller.isActive = !seller.isActive
    this.sellerService.updateSeller(seller)
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
