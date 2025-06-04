import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RubberSale } from '../_interface/rubberSale';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RubberSalesComponent } from '../rubber-sale/rubber-sales.component';
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Buyer } from '../_interface/buyer';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { BuyerService } from '../_services/buyer.service';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { SubscriptionService } from '../_services/subscription.service';
import { SpinnerService } from '../_services/spinner.service';

@Component({
  selector: 'app-rubber-sale-detail',
  templateUrl: './rubber-sale-detail.component.html',
  styleUrls: ['./rubber-sale-detail.component.css']
})
export class RubberSaleDetailComponent implements OnInit, OnDestroy {
  rubberSale: RubberSale = {} as RubberSale
  filterRubberSale: any = {} as any


  buyers: Buyer[] = []

  formattedDate = ''
  deliveryAgent: string = ''
  isComplete: string = ''

  todayDateWeight = ''
  todayDateReceipt = ''

  todayDate = new Date().toISOString().split('T')[0];


  constructor(
    public dialogRef: MatDialogRef<RubberSalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: RubberSale },
    private buyerService: BuyerService,
    private rubberSaleService: RubberSaleService,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    //This creates a deep copy — a new object with its own independent properties.
    this.rubberSale = JSON.parse(JSON.stringify(this.data.data));
    this.rubberSale.weightSlipNoDate = this.todayDate
    this.rubberSale.receiptNoDate = this.todayDate
    if (this.rubberSale.deliveryAgent != "") {
      this.deliveryAgent = 'yes'
    }
    else {
      this.deliveryAgent = 'no'
    }
    this.setDate()
    this.getBuyer();
  }

  setDate() {
    const date = new Date(this.rubberSale.saleDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    this.rubberSale.saleDateTime = `${year}-${month}-${day}`;
  }

  checkDate(selectedDateString: string) {
    const selectedDate = new Date(selectedDateString);
    const today = new Date(this.todayDate);

    if (selectedDate > today) {
      swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Date cannot be in the future!',
        confirmButtonText: 'OK'
      }).then(() => {
        this.rubberSale.saleDateTime = this.data.data.saleDateTime;
        this.setDate();
        this.cd.detectChanges();
      });
    }
  }

  getBuyer() {
    const getBuyer = this.buyerService.getBuyer()
      .subscribe(
        Response => {
          const buyers = Response
          this.buyers = buyers.filter(x => x.isActive == true && x.estateId == this.sharedService.estateId)
        }
      )
    this.subscriptionService.add(getBuyer);

  }

  back() {
    this.dialogRef.close()
  }

  update() {
    if (this.rubberSale.drc == 0) {
      swal.fire({
        title: 'Error!',
        text: 'DRC cannot be 0. Please enter a valid percentage.',
        icon: 'error',
        showConfirmButton: true
      });
    } else if (this.deliveryAgent == 'yes' && this.rubberSale.deliveryAgent == '') {
      swal.fire({
        title: 'Error!',
        text: 'Please enter the delivery agent name',
        icon: 'error',
        showConfirmButton: true
      });
    }
    else {
      this.spinnerService.requestStarted()
      if (this.isComplete == "yes") {
        if (this.rubberSale.weightSlipNo != null && this.rubberSale.receiptNo != null) {
          swal.fire({
            title: 'Are you sure to submit ? ',
            text: 'There is no editing after submission',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'Cancel',
          })
            .then((result) => {
              if (result.isConfirmed) {
                this.rubberSale.paymentStatus = null;
                this.rubberSaleService.updateWeightSlip(this.rubberSale.letterOfConsentNo, this.rubberSale)
                  .subscribe(
                    Response => {
                      if (this.rubberSale.receiptNo != null) {
                        this.rubberSaleService.updateReceiptNo(this.rubberSale.letterOfConsentNo, this.rubberSale)
                          .subscribe(
                            Response => {
                              swal.fire({
                                title: 'Done!',
                                text: 'Rubber Sale successfully updated!',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1000
                              });
                              this.dialogRef.close();
                            }
                          );
                      }
                    })
              } else {
                this.spinnerService.requestEnded()
              }
            }
            );
        }
        else {
          // Error case: Neither Weight Slip No nor Receipt No
          swal.fire({
            title: 'Error!',
            text: 'Please fill up the form',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.spinnerService.requestEnded()
        }
      } else {
        this.rubberSale.updatedBy = this.sharedService.userId.toString()
        this.rubberSale.updatedDate = new Date()
        this.rubberSale.transportPlateNo = this.rubberSale.transportPlateNo.replace(/\s+/g, '');
        const { paymentStatus, ...filterSale } = this.rubberSale
        this.filterRubberSale = filterSale
        this.rubberSaleService.updateSale(this.filterRubberSale)
          .subscribe(
            Response => {
              this.spinnerService.requestEnded()
              swal.fire({
                title: 'Done!',
                text: 'Rubber Sale successfully updated!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
              this.dialogRef.close()
            }
          )
      }
    }
  }

  calculateTotalPrice() {
    const total = this.rubberSale.unitPrice * this.rubberSale.wetWeight
    // this.rubberSale.total = total.toFixed(2)
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  deliveryAgentRemark() {
    this.rubberSale.remark = 'Using delivery agent : ' + this.rubberSale.deliveryAgent
  }

  validateCuplumpDRC(drc: any) {
    const drcValue = drc.target.value
    if (drcValue >= 45 && drcValue <= 100) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'CuplumpDRC must be between 45% to 100%',
        icon: 'error',
        showConfirmButton: true
      });
      if (this.isComplete == 'yes') {
        this.rubberSale.buyerDRC = 0
      } else {
        this.rubberSale.drc = 0
      }
    }
  }

  validateLatexDRC(drc: any) {
    const drcValue = drc.target.value
    if (drcValue >= 20 && drcValue <= 55) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'LatexDRC must be between 20% to 55%',
        icon: 'error',
        showConfirmButton: true
      });
      if (this.isComplete == 'yes') {
        this.rubberSale.buyerDRC = 0
      } else {
        this.rubberSale.drc = 0
      }
    }

  }

  checkBuyerWeight() {
    if (this.rubberSale.buyerWetWeight > this.rubberSale.wetWeight) {
      swal.fire({
        title: 'Error!',
        text: 'Buyer Wet Weight cannot more than Wet Weight',
        icon: 'error',
        showConfirmButton: true
      });
      this.rubberSale.buyerWetWeight = 0
    }
  }

  calculateAmount() {
    if (this.rubberSale.rubberType == "CUPLUMP") {
      const amount = this.rubberSale.buyerWetWeight * this.rubberSale.unitPrice
      this.rubberSale.total = amount
    }
    else if (this.rubberSale.rubberType == "LATEX") {
      const amount = this.rubberSale.buyerWetWeight * (this.rubberSale.buyerDRC / 100) * this.rubberSale.unitPrice
      this.rubberSale.total = amount
    }
  }

}
