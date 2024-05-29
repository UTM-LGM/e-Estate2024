import { Component, OnDestroy, OnInit } from '@angular/core';
import { Buyer } from 'src/app/_interface/buyer';
import { BuyerService } from 'src/app/_services/buyer.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register-buyer',
  templateUrl: './register-buyer.component.html',
  styleUrls: ['./register-buyer.component.css']
})
export class RegisterBuyerComponent implements OnInit, OnDestroy {

  buyer: Buyer = {} as Buyer

  buyers: Buyer[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  result = {} as any


  sortableColumns = [
    { columnName: 'licenseNo', displayText: 'Lisence No' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
  ];

  constructor(
    private buyerService: BuyerService,
    private sharedService: SharedService,
    private myLesenService:MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getBuyer()
    this.buyer.licenseNo = ''
    this.result.premiseName = ''
  }

  submit() {
    if (this.buyer.licenseNo === '' && this.result.premiseName === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.buyers.some(s => s.licenseNo.toLowerCase() === this.buyer.licenseNo.toLowerCase())) {
      swal.fire({
        text: 'Buyer already exists!',
        icon: 'error'
      });
    }
    else {
      this.buyer.buyerName = this.result.premiseName
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
      const getBuyer = this.buyerService.getBuyer()
        .subscribe(
          Response => {
            const buyers = Response
            this.buyers = buyers.filter(x=>x.estateId == this.sharedService.estateId)
            this.isLoading = false
          });
      this.subscriptionService.add(getBuyer);
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

  checkLicenseNo(event: any) {
    setTimeout(() => {
    const getLicenseNo = this.myLesenService.getLicenseNo(event.target.value.toString())
      .subscribe(
        {
          next: (Response) => {
            this.result = Response
            swal.fire({
              title: 'Done!',
              text: 'Data found!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
          this.subscriptionService.add(getLicenseNo);
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: 'Error! License No does not exist',
            });
            this.buyer.licenseNo = ''
            this.result = {}
          }
        })
      },1000)
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  

}
