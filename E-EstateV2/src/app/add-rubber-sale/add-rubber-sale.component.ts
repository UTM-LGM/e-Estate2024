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
import { EstateDetailService } from '../_services/estate-detail.service';

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
  estateDetail: any = {} as any
  estateDetailNull: boolean = true
  todayDate = new Date().toISOString().split('T')[0];

  constructor(
    private buyerService: BuyerService,
    private rubberSaleService: RubberSaleService,
    private location: Location,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService,
    private myLesenService: MyLesenIntegrationService,
    private estateDetailService: EstateDetailService,
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getBuyer()
    this.getEstate()
    this.rubberSale.saleDateTime = this.todayDate
  }

  checkDate() {
    const selectedDate = new Date(this.rubberSale.saleDateTime);
    const today = new Date(this.todayDate);

    const maxAllowedDate = new Date(today);
    maxAllowedDate.setDate(today.getDate() + 1);

    if (selectedDate > maxAllowedDate) {
      swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Date cannot be in the future!',
        confirmButtonText: 'OK'
      }).then(() => {
        this.rubberSale.saleDateTime = this.todayDate;
      });
    }
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
          this.checkEstateDetail()
          this.rubberSale.licenseNoTrace = this.estate.licenseNoTrace
        }
      )
    this.subscriptionService.add(getOneEstate);
  }

  checkEstateDetail() {
    const getEstateDetail = this.estateDetailService.getEstateDetailbyEstateId(this.sharedService.estateId)
      .subscribe(
        Response => {
          if (Response != null) {
            this.estateDetail = Response
            this.estateDetailNull = false
            this.spinnerService.requestEnded()
          }
          else {
            this.spinnerService.requestEnded()
            // If the estate detail is null, show the alert
            swal.fire({
              icon: 'info',
              title: 'Information',
              text: 'Please update Estate Profile in General',
            });

          }
        }
      )
    this.subscriptionService.add(getEstateDetail)
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

  async addSale() {
    const selectedDate = new Date(this.rubberSale.saleDateTime);
    const today = new Date(this.todayDate);
    if (selectedDate < today) {
      const result = await swal.fire({
        title: 'Warning!',
        text: 'The selected sale date is in the past. Do you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'Back'
      });

      if (!result.isConfirmed) {
        return; // Stop here if user clicks "Back"
      }
    }

    // Execute the main logic whether confirmed (for past date) or if date is today/future
    this.processRubberSale();
  }

  processRubberSale() {
    const selectedDate = new Date(this.rubberSale.saleDateTime);
    const today = new Date(this.todayDate);
    if (this.rubberSale.saleDateTime) {
      if (this.rubberSale.drc == 0) {
        swal.fire({
          title: 'Error!',
          text: 'DRC cannot be 0. Please enter a valid percentage.',
          icon: 'error',
          showConfirmButton: true
        });
        return;
      }

      if (this.rubberSale.deliveryAgent == '' && this.deliveryAgent == 'yes') {
        swal.fire({
          title: 'Error!',
          text: 'Please enter the delivery agent name',
          icon: 'error',
          showConfirmButton: true
        });
        return;
      }

      if (this.rubberSale.rubberType == "0") {
        swal.fire({
          title: 'Error!',
          text: 'Please choose rubber type!',
          icon: 'error',
          showConfirmButton: true
        });
        return;
      }

      if (this.rubberSale.transportPlateNo?.trim()) {
        if (selectedDate >= today) {
          this.generateLetterOfConsetnNo();

        }

        this.spinnerService.requestStarted();
        this.rubberSale.isActive = true;
        this.rubberSale.createdBy = this.sharedService.userId.toString();
        this.rubberSale.createdDate = new Date();
        this.rubberSale.estateId = this.sharedService.estateId;
        this.rubberSale.paymentStatusId = 1;
        this.rubberSale.letterOfConsentNo = this.letterOfConsentNo;
        this.rubberSale.transportPlateNo = this.rubberSale.transportPlateNo.replace(/\s+/g, '');
        this.rubberSale.msnrStatus = this.estateDetail.msnrStatus;
        this.rubberSale.polygonArea = this.estateDetail.polygonArea;
        this.isSubmit = true;

        this.rubberSaleService.addSale(this.rubberSale).subscribe({
          next: (Response) => {
            swal.fire({
              title: 'Done!',
              text: 'Rubber Sale successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.ngOnInit();
            this.spinnerService.requestEnded();
            this.print(Response);
            this.location.back();
          },
          error: (err) => {
            this.spinnerService.requestEnded();
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please fill up the form',
            });
            this.isSubmit = false;
          }
        });
      } else {
        this.spinnerService.requestEnded();
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill up the form',
        });
        this.isSubmit = false;
      }
    }
  }

  formatDriverIc() {
    if (!this.rubberSale.driverIc) return;

    let ic = this.rubberSale.driverIc.replace(/\D/g, ''); // Remove non-digit characters

    if (ic.length > 6) {
      ic = ic.slice(0, 6) + '-' + ic.slice(6);
    }
    if (ic.length > 9) {
      ic = ic.slice(0, 9) + '-' + ic.slice(9);
    }
    if (ic.length > 14) {
      ic = ic.slice(0, 14); // Limit max formatted length
    }

    this.rubberSale.driverIc = ic;
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

    const status = this.estateDetail.msnrStatus;
    const isMsnr =
      status === true ||
      status === 1 ||
      (typeof status === 'string' && ['true', '1'].includes(status.toLowerCase()));

    if (isMsnr) {
      const msnr = 'MSNR';
      this.letterOfConsentNo = `E${year}${month}${day}${hours}${minutes}${seconds}${msnr}`;
    } else {
      this.letterOfConsentNo = `E${year}${month}${day}${hours}${minutes}${seconds}`;
    }

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

  deliveryRemark() {
    this.rubberSale.remark = ''
    this.rubberSale.deliveryAgent = ''
  }

}
