import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-rubber-sale-detail',
  templateUrl: './rubber-sale-detail.component.html',
  styleUrls: ['./rubber-sale-detail.component.css']
})
export class RubberSaleDetailComponent implements OnInit {
  rubberSale: RubberSale = {} as RubberSale

  buyers: Buyer[] = []

  formattedDate = ''

  constructor(
    public dialogRef: MatDialogRef<RubberSalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: RubberSale },
    private datePipe: DatePipe,
    private buyerService: BuyerService,
    private rubberSaleService: RubberSaleService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.rubberSale = this.data.data
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
    this.buyerService.getBuyer()
      .subscribe(
        Response => {
          this.buyers = Response
        }
      )
  }

  back() {
    this.dialogRef.close()
  }

  update() {
    this.rubberSale.updatedBy = this.sharedService.userId.toString()
    this.rubberSale.updatedDate = new Date()
    this.rubberSaleService.updateSale(this.rubberSale)
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

  calculateTotalPrice(){
    const total = this.rubberSale.unitPrice * (this.rubberSale.wetWeight*this.rubberSale.drc/100)
    this.rubberSale.total = total.toFixed(2)
  }

}
