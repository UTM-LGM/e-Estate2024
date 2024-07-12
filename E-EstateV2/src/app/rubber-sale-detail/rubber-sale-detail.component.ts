import { Component, OnDestroy, OnInit } from '@angular/core';
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


  constructor(
    public dialogRef: MatDialogRef<RubberSalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: RubberSale },
    private datePipe: DatePipe,
    private buyerService: BuyerService,
    private rubberSaleService: RubberSaleService,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    this.rubberSale = this.data.data
    if (this.rubberSale.deliveryAgent != null) {
      this.deliveryAgent = 'yes'
    }
    else {
      this.deliveryAgent = 'no'
    }
    this.formattedDate = this.datePipe.transform(this.rubberSale.saleDateTime, 'yyyy-MM-dd') || ''
    if (this.formattedDate) {
      setTimeout(() => {
        this.rubberSale.saleDateTime = new Date(this.formattedDate)
      }, 0);
    }
    this.getBuyer();
  }

  selectedDate(date: string) {
    if (date) {
      this.rubberSale.saleDateTime = new Date(date)
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
    } else {
      this.rubberSale.updatedBy = this.sharedService.userId.toString()
      this.rubberSale.updatedDate = new Date()
      this.rubberSale.transportPlateNo = this.rubberSale.transportPlateNo.replace(/\s+/g, '');
      const { paymentStatus, ...filterSale } = this.rubberSale
      this.filterRubberSale = filterSale
      this.rubberSaleService.updateSale(this.filterRubberSale)
        .subscribe(
          Response => {
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
    if (drcValue >= 45 && drcValue <= 80) {
      return drcValue
    }
    else {
      swal.fire({
        title: 'Error!',
        text: 'CuplumpDRC must be between 45% to 80%',
        icon: 'error',
        showConfirmButton: true
      });
      this.rubberSale.drc = 0
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
      this.rubberSale.drc = 0
    }

  }

}
