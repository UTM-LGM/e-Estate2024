import { Component, Inject, OnInit } from '@angular/core';
import { RubberPurchase } from '../_interface/rubberPurchase';
import { RubberPurchaseComponent } from '../rubber-purchase/rubber-purchase.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { Seller } from '../_interface/seller';
import { SellerService } from '../_services/seller.service';
import { RubberPurchaseService } from '../_services/rubber-purchase.service';

@Component({
  selector: 'app-rubber-purchase-detail',
  templateUrl: './rubber-purchase-detail.component.html',
  styleUrls: ['./rubber-purchase-detail.component.css']
})
export class RubberPurchaseDetailComponent implements OnInit {
  rubberPurchase: RubberPurchase = {} as RubberPurchase

  sellers: Seller[] = []

  formattedDate = ''

  constructor(
    public dialogRef: MatDialogRef<RubberPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: RubberPurchase },
    private datePipe: DatePipe,
    private sellerService: SellerService,
    private sharedService: SharedService,
    private rubberPurchaseService: RubberPurchaseService
  ) { }

  ngOnInit() {
    this.rubberPurchase = this.data.data
    this.formattedDate = this.datePipe.transform(this.rubberPurchase.date, 'yyyy-MM-dd') || '';
    if (this.formattedDate) {
      setTimeout(() => {
        this.rubberPurchase.date = new Date(this.formattedDate)
      }, 0);
    }
    this.getSeller()
  }

  selectedDate(date: string) {
    if (date) {
      this.rubberPurchase.date = new Date(date)
    }
  }

  getSeller() {
    this.sellerService.getSeller()
      .subscribe(
        Response => {
          this.sellers = Response
        }
      )
  }

  back() {
    this.dialogRef.close()
  }

  update() {
    this.rubberPurchase.updatedBy = this.sharedService.userId.toString()
    this.rubberPurchase.updatedDate = new Date()
    this.rubberPurchaseService.updatePurchase(this.rubberPurchase)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Rubber Purchase successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )
  }

  calculateTotalPrice() {
    const total = this.rubberPurchase.price * this.rubberPurchase.weight
    this.rubberPurchase.totalPrice = total
  }

}
