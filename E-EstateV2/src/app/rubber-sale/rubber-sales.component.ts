import { Component, OnInit } from '@angular/core';
import { RubberSale } from '../_interface/rubberSale';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RubberSaleDetailComponent } from '../rubber-sale-detail/rubber-sale-detail.component';
import { SharedService } from '../_services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { EstateService } from '../_services/estate.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-rubber-sales',
  templateUrl: './rubber-sales.component.html',
  styleUrls: ['./rubber-sales.component.css']
})
export class RubberSalesComponent implements OnInit {
  term = ''
  pageNumber = 1
  isLoading = true

  estate: any = {} as any

  filterSales: RubberSale[] = []

  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'date', displayText: 'Date' },
    // { columnName: 'status', displayText: 'Status' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
    { columnName: 'transportPlateNo', displayText: 'Transport Plate No' },
    { columnName: 'driverName', displayText: 'Driver Name' },
    { columnName: 'rubberType', displayText: 'Rubber Type' },
    { columnName: 'letterOfConsentNo', displayText: 'Letter of Consent No (Form 1)' },
    { columnName: 'weightSlipNo', displayText: 'Weight Slip No'},
    { columnName: 'receiptNo', displayText: 'Receipt No'},
    { columnName: 'wetWeight', displayText: 'Wet Weight (Kg)' },
    { columnName: 'drc', displayText: 'DRC (%)'},
    { columnName: 'buyerWetWeight', displayText: 'Buyer Wet Weight (Kg)' },
    { columnName: 'buyerDRC', displayText: 'Buyer DRC (%)' },
    { columnName: 'buyerWeightDry', displayText: 'Buyer Weight Dry (Kg)'},
    { columnName: 'unitPrice', displayText: 'Unit Price (RM/kg)' },
    { columnName: 'total', displayText: 'Total Price (RM)' },
    { columnName: 'remark', displayText: 'Remark' }

  ];

  constructor(
    private rubberSaleService: RubberSaleService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getEstate()
    this.getSales()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.isLoading = false
              })
      this.subscriptionService.add(getOneEstate);

        }
      });
    }, 2000)
  }

  getSales() {
    setTimeout(() => {
     const getSale =  this.rubberSaleService.getSale()
        .subscribe(
          Response => {
            const rubberSales = Response
            this.filterSales = rubberSales.filter((e) => e.estateId == this.sharedService.estateId)
            this.isLoading = false
          })
      this.subscriptionService.add(getSale);

    }, 2000)
  }

  status(sale: RubberSale) {
    sale.updatedBy = this.sharedService.userId.toString()
    sale.updatedDate = new Date()
    sale.isActive = !sale.isActive
    this.rubberSaleService.updateSale(sale)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Sale Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      );
  }

  openDialog(sale: RubberSale): void {
    const dialogRef = this.dialog.open(RubberSaleDetailComponent, {
      data: { data: sale },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        });
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  printForm1(sale: RubberSale) {
    const url = 'generate-form-1/' + sale.id;
    window.open(url, '_blank');
  }

  print(sale:RubberSale){

  }

  getPaymentStatus(sale:RubberSale): { status: string, color: string } {
    if (sale.paymentStatusId === 3) {
      return { status: 'Complete', color: 'green' };
    } else {
      return { status: 'In Process', color: '#c9c912' };
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
