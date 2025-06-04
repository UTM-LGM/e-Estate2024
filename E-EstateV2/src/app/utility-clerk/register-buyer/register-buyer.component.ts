import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Buyer } from 'src/app/_interface/buyer';
import { BuyerService } from 'src/app/_services/buyer.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import { EditBuyerComponent } from '../edit-buyer/edit-buyer.component';

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
  itemsPerPage = 10
  licenseNo = ''

  sortableColumns = [
    { columnName: 'licenseNo', displayText: 'Lisence No' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
    { columnName: 'renameBuyer', displayText: 'Rename Buyer' },

  ];

  constructor(
    private buyerService: BuyerService,
    private sharedService: SharedService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isLoading = true
    this.getBuyer()
    this.buyer.licenseNo = ''
    this.result.premiseName = ''
    this.licenseNo = this.sharedService.licenseNo
  }

  submit() {
    if (this.buyer.licenseNo == '' || this.result.premiseName == '' || this.buyer.renameBuyer == null) {
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
      this.spinnerService.requestStarted()
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
            this.spinnerService.requestEnded()
          })
    }
  }

  reset() {
    this.buyer = {} as Buyer
  }

  getBuyer() {
    setTimeout(() => {
      this.buyer.estateId = this.sharedService.estateId
      const getBuyer = this.buyerService.getBuyerByEstateId(this.buyer.estateId)
        .subscribe(
          Response => {
            this.buyers = Response
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
    this.spinnerService.requestStarted()
    setTimeout(() => {
      const getLicenseNo = this.myLesenService.getAllByLicenseNo(event.target.value.toString())
        .subscribe(
          {
            next: (Response) => {
              if (Response) {
                this.result = Response
                this.result.premiseName = this.result.premiseName + "," + this.result.premiseAdd1.slice(0, -1)
                this.spinnerService.requestEnded()
                swal.fire({
                  title: 'Done!',
                  text: 'Data found!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
              } else {
                this.spinnerService.requestEnded();
                swal.fire({
                  icon: 'error',
                  title: 'Error! License No does not exist',
                });
                this.buyer.licenseNo = ''
                this.buyer.renameBuyer = ''
                this.result = {}
              }

            },
            error: (Error) => {
              this.spinnerService.requestEnded();
              swal.fire({
                icon: 'error',
                title: 'Error! License No does not exist',
              });
              this.buyer.licenseNo = ''
              this.result = {}
            }
          })
      this.subscriptionService.add(getLicenseNo);

    }, 1000)
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

  openDialog(buyer:Buyer){
    const dialogRef = this.dialog.open(EditBuyerComponent,{
      data: { data: buyer },
    })
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }





}
