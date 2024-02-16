import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RubberPurchase } from '../_interface/rubberPurchase';
import { SharedService } from '../_services/shared.service';
import { RubberPurchaseService } from '../_services/rubber-purchase.service';
import swal from 'sweetalert2';
import { Seller } from '../_interface/seller';
import { SellerService } from '../_services/seller.service';

@Component({
  selector: 'app-add-rubber-purchase',
  templateUrl: './add-rubber-purchase.component.html',
  styleUrls: ['./add-rubber-purchase.component.css']
})
export class AddRubberPurchaseComponent implements OnInit {
  currentDate = ''

  rubberPurchase: RubberPurchase = {} as RubberPurchase

  sellers: Seller[] = []

  constructor(
    private location: Location,
    private sellerService: SellerService,
    private sharedService: SharedService,
    private rubberPurchaseService: RubberPurchaseService
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getSeller()
    this.currentDate = new Date().toISOString().substring(0, 10)
    if (this.currentDate) {
      this.rubberPurchase.date = new Date(this.currentDate)
    }
  }

  initialForm() {
    this.rubberPurchase = {} as RubberPurchase
    this.rubberPurchase.sellerId = 0
    this.rubberPurchase.rubberType = '0'
    this.rubberPurchase.project = 'Common Purchases'
  }

  getSeller() {
    this.sellerService.getSeller()
      .subscribe(
        Response => {
          const sellers = Response
          this.sellers = sellers.filter(x => x.isActive == true)
        }
      )
  }

  selectedDate(date: string) {
    if (date) {
      this.rubberPurchase.date = new Date(date)
    }
  }

  addPurchase() {
    this.rubberPurchase.isActive = true
    this.rubberPurchase.companyId = this.sharedService.companyId
    this.rubberPurchase.createdBy = this.sharedService.userId.toString()
    this.rubberPurchase.createdDate = new Date()
    this.rubberPurchase.estateId = this.sharedService.estateId
    this.rubberPurchaseService.addPurchase(this.rubberPurchase)
      .subscribe(
        {
          next: (Response) => {
            swal.fire({
              title: 'Done!',
              text: 'Rubber Purchase successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.ngOnInit()
          },
          error: (err) => {
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please fill up the form',
            });
          }
        })
  }

  back() {
    this.location.back()
  }

  calculateTotalPrice(){
    const total = this.rubberPurchase.price * this.rubberPurchase.weight
    this.rubberPurchase.totalPrice = total
  }
}
