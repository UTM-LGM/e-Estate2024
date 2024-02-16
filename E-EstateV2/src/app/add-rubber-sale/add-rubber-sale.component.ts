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
      this.rubberSale.date = new Date(this.currentDate)
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
          this.buyers = buyers.filter(x => x.isActive == true)
        }
      )
  }

  selectedDate(date: string) {
    if (date) {
      this.rubberSale.date = new Date(date)
    }
  }

  addSale() {
    this.rubberSale.isActive = true
    this.rubberSale.companyId = this.sharedService.companyId
    this.rubberSale.createdBy = this.sharedService.userId.toString()
    this.rubberSale.createdDate = new Date()
    this.rubberSale.estateId = this.sharedService.estateId
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

}
