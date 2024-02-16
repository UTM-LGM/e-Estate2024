import { Component, OnInit } from '@angular/core';
import { Buyer } from 'src/app/_interface/buyer';
import { BuyerService } from 'src/app/_services/buyer.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register-buyer',
  templateUrl: './register-buyer.component.html',
  styleUrls: ['./register-buyer.component.css']
})
export class RegisterBuyerComponent implements OnInit {

  buyer: Buyer = {} as Buyer

  buyers: Buyer[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'licenseNo', displayText: 'Lisence No' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
  ];

  constructor(
    private buyerService: BuyerService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getBuyer()
    this.buyer.licenseNo = ''
  }

  submit() {
    if (this.buyer.licenseNo === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.buyers.some(s => s.buyerName.toLowerCase() === this.buyer.buyerName.toLowerCase())) {
      swal.fire({
        text: 'Buyer name already exists!',
        icon: 'error'
      });
    }
    else {
      this.buyer.isActive = true
      this.buyer.createdBy = this.sharedService.userId.toString()
      this.buyer.createdDate = new Date()
      this.buyer.estateId = this.sharedService.estateId
      this.buyerService.addBuyer(this.buyer)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Buyer successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          })
    }
  }

  reset() {
    this.buyer = {} as Buyer
  }

  getBuyer() {
    setTimeout(() => {
      this.buyerService.getBuyer()
        .subscribe(
          Response => {
            this.buyers = Response
            this.isLoading = false
          });
    }, 2000)
  }

  status(buyer: Buyer) {
    buyer.updatedBy = this.sharedService.userId.toString()
    buyer.updatedDate = new Date()
    buyer.isActive = !buyer.isActive
    this.buyerService.updateBuyer(buyer)
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
