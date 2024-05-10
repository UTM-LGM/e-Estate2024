import { Component, OnInit } from '@angular/core';
import { Buyer } from '../_interface/buyer';
import { RubberSale } from '../_interface/rubberSale';
import { RubberSaleService } from '../_services/rubber-sale.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import { BuyerService } from '../_services/buyer.service';

@Component({
  selector: 'app-add-rubber-sale',
  templateUrl: './add-rubber-sale.component.html',
  styleUrls: ['./add-rubber-sale.component.css']
})
export class AddRubberSaleComponent implements OnInit {

  buyers: Buyer[] = []

  rubberSale: RubberSale = {} as RubberSale

  currentDate = ''
  letterOfConsentNo = ''

  constructor(
    private buyerService: BuyerService,
    private rubberSaleService: RubberSaleService,
    private location: Location,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getBuyer()
    this.currentDate = new Date().toISOString().substring(0, 10)
    if (this.currentDate) {
      this.rubberSale.saleDateTime = new Date(this.currentDate)
    }
  }

  initialForm() {
    this.rubberSale = {} as RubberSale
    this.rubberSale.buyerId = 0
    this.rubberSale.rubberType = '0'
  }

  getBuyer() {
    this.buyerService.getBuyer()
      .subscribe(
        Response => {
          const buyers = Response
          this.buyers = buyers.filter(x => x.isActive == true && x.estateId == this.sharedService.estateId)
        }
      )
  }

  selectedDate(date: string) {
    if (date) {
      this.rubberSale.saleDateTime = new Date(date)
    }
  }

  addSale() {
    this.generateLetterOfConsetnNo()
    this.rubberSale.isActive = true
    this.rubberSale.createdBy = this.sharedService.userId.toString()
    this.rubberSale.createdDate = new Date()
    this.rubberSale.estateId = this.sharedService.estateId
    this.rubberSale.paymentStatusId = 1
    this.rubberSale.letterOfConsentNo = this.letterOfConsentNo
    this.rubberSaleService.addSale(this.rubberSale)
      .subscribe(
        {
          next: (Response) => {
            swal.fire({
              title: 'Done!',
              text: 'Rubber Sale successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.ngOnInit()
            this.print(Response)
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

  calculateTotalPrice() {
    const total = this.rubberSale.unitPrice * this.rubberSale.wetWeight
    this.rubberSale.total = total.toFixed(2)
  }

  generateLetterOfConsetnNo() {
    const currentDate = new Date();

    const year = currentDate.getFullYear().toString().substring(2); // Get last two digits of the year
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const day = ('0' + currentDate.getDate()).slice(-2); // Ensure two digits for day
    const hours = ('0' + currentDate.getHours()).slice(-2); // Ensure two digits for hours
    const minutes = ('0' + currentDate.getMinutes()).slice(-2); // Ensure two digits for minutes

    this.letterOfConsentNo = `E1${year}${month}${day}${hours}${minutes}`;
  }

  print(sale: RubberSale) {
    const url = 'generate-form-1/' + sale.id;
    window.open(url, '_blank');
  }

}
