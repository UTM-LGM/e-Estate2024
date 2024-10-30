import { Component, OnDestroy, OnInit } from '@angular/core';
import { Buyer } from '../_interface/buyer';
import { RubberSale } from '../_interface/rubberSale';
import { RubberSaleService } from '../_services/rubber-sale.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import { BuyerService } from '../_services/buyer.service';
import { SubscriptionService } from '../_services/subscription.service';
import { SpinnerService } from '../_services/spinner.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';

@Component({
  selector: 'app-add-rubber-sale',
  templateUrl: './add-rubber-sale.component.html',
  styleUrls: ['./add-rubber-sale.component.css']
})
export class AddRubberSaleComponent implements OnInit, OnDestroy {

  buyers: Buyer[] = []

  rubberSale: RubberSale = {} as RubberSale

  currentDate = ''
  letterOfConsentNo = ''

  deliveryAgent: string = ''
  isSubmit = false

  estate: any = {} as any


  constructor(
    private buyerService: BuyerService,
    private rubberSaleService: RubberSaleService,
    private location: Location,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService,
    private myLesenService: MyLesenIntegrationService,
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getBuyer()
    this.currentDate = new Date().toISOString().substring(0, 10)
    if (this.currentDate) {
      this.rubberSale.saleDateTime = new Date(this.currentDate)
    }
    this.getEstate()
  }

  initialForm() {
    this.deliveryAgent = ''
    this.rubberSale = {} as RubberSale
    this.rubberSale.buyerId = 0
    this.rubberSale.rubberType = '0'
  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.sharedService.estateId)
      .subscribe(
        Response => {
          this.estate = Response
          this.rubberSale.licenseNoTrace = this.estate.licenseNoTrace
        }
      )
    this.subscriptionService.add(getOneEstate);
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

  selectedDate(date: string) {
    if (date) {
      this.rubberSale.saleDateTime = new Date(date)
    }
  }

  addSale() {
    if (this.rubberSale.drc == 0) {
      swal.fire({
        title: 'Error!',
        text: 'DRC cannot be 0. Please enter a valid percentage.',
        icon: 'error',
        showConfirmButton: true
      });
    } else {
      this.isTodayOrFutureDate(this.rubberSale.saleDateTime)
      if (this.isTodayOrFutureDate(this.rubberSale.saleDateTime)) {
        this.generateLetterOfConsetnNo();
      }
      this.spinnerService.requestStarted()
      this.rubberSale.isActive = true
      this.rubberSale.createdBy = this.sharedService.userId.toString()
      this.rubberSale.createdDate = new Date()
      this.rubberSale.estateId = this.sharedService.estateId
      this.rubberSale.paymentStatusId = 1
      this.rubberSale.letterOfConsentNo = this.letterOfConsentNo
      this.rubberSale.transportPlateNo = this.rubberSale.transportPlateNo.replace(/\s+/g, '');
      this.isSubmit = true
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
              this.spinnerService.requestEnded();
              this.print(Response)
              this.location.back()
            },
            error: (err) => {
              swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill up the form',
              });
              this.isSubmit = false
            }
          })
    }
  }

  isTodayOrFutureDate(date: Date): boolean {
    // Get today's date without the time component
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero

    // Set the provided date's time component to zero for comparison
    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return dateToCompare >= yesterday;
  }


  back() {
    this.location.back()
  }

  calculateTotalPrice() {
    const total = this.rubberSale.unitPrice * this.rubberSale.wetWeight
    //this.rubberSale.total = total.toFixed(2)
  }

  generateLetterOfConsetnNo() {
    const currentDate = new Date();

    const year = currentDate.getFullYear().toString().substring(2) // Get last two digits of the year
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2) // Ensure two digits for month
    const day = ('0' + currentDate.getDate()).slice(-2) // Ensure two digits for day
    const hours = ('0' + currentDate.getHours()).slice(-2) // Ensure two digits for hours
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);// Ensure two digits for minutes
    const seconds = ('0' + currentDate.getSeconds()).slice(-2)
    //const checksum = (year + month + day + hours + minutes + seconds).slice(-2)
    this.letterOfConsentNo = `E${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  print(sale: RubberSale) {
    const url = 'generate-form-1/' + sale.id;
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  deliveryAgentRemark() {
    this.rubberSale.remark = 'Using delivery agent : ' + this.rubberSale.deliveryAgent
  }

  validateDriverIc(driverIc: string) {
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;

    if (!icPattern.test(driverIc)) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Driver IC number must be in xxxxxx-xx-xxxx format.'
      });
      this.rubberSale.driverIc = '';
    }
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
