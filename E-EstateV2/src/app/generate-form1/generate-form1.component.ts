import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { RubberSale } from '../_interface/rubberSale';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-generate-form1',
  templateUrl: './generate-form1.component.html',
  styleUrls: ['./generate-form1.component.css']
})
export class GenerateForm1Component implements OnInit, OnDestroy {

  rubberSale: RubberSale = {} as RubberSale
  estate: any = {} as any
  buyer: any = {} as any
  dateNow: any
  qrcodedata: any = {};

  constructor(
    private route: ActivatedRoute,
    private rubberSaleService: RubberSaleService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit(): void {
    this.getRubberSale()
    this.dateNow = new Date()
  }

  getRubberSale() {
    this.route.params.subscribe((routerParams) => {
      if (routerParams['id'] != null) {
        const getRubberSale = this.rubberSaleService.getRubberSaleById(routerParams['id'])
          .subscribe(
            Response => {
              this.rubberSale = Response
              this.qrcodedata = JSON.stringify({
                letterOfConsentNo: this.rubberSale.letterOfConsentNo,
                buyerid: this.rubberSale.buyerLicenseNo
              })
              this.getEstateDetail()
              this.getBuyerDetail()
            }
          )
      this.subscriptionService.add(getRubberSale);

      }
    })
  }

  getEstateDetail() {
    const getEstateDetail = this.myLesenService.getOneEstate(this.rubberSale.estateId)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
      this.subscriptionService.add(getEstateDetail);

  }

  getBuyerDetail() {
    const getLicenseNo = this.myLesenService.getAllByLicenseNo(this.rubberSale.buyerLicenseNo)
      .subscribe(
        Response => {
          this.buyer = Response
        }
      )
      this.subscriptionService.add(getLicenseNo);

  }

  print() {
    window.print()
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
