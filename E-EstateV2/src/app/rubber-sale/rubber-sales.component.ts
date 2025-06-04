import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { EstateDetailService } from '../_services/estate-detail.service';

@Component({
  selector: 'app-rubber-sales',
  templateUrl: './rubber-sales.component.html',
  styleUrls: ['./rubber-sales.component.css']
})
export class RubberSalesComponent implements OnInit, OnDestroy {
  term = ''
  pageNumber = 1
  isLoading = true

  estate: any = {} as any

  filterSales: RubberSale[] = []
  estateDetail: any = {} as any


  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'date', displayText: 'Date' },
    // { columnName: 'status', displayText: 'Status' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
    { columnName: 'rubberType', displayText: 'Rubber Type' },
    { columnName: 'letterOfConsentNo', displayText: 'Letter of Consent No (Form 1)' },
    { columnName: 'weightSlipNo', displayText: 'Weight Slip No' },
    { columnName: 'receiptNo', displayText: 'Receipt No' },
    { columnName: 'wetWeight', displayText: 'Wet Weight (Kg)' },
    { columnName: 'drc', displayText: 'DRC (%)' },
    { columnName: 'remark', displayText: 'Remark' }

  ];

  constructor(
    private rubberSaleService: RubberSaleService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private estateService: EstateDetailService,
    private router: Router
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
                this.checkEstateDetail()
                this.isLoading = false
              })
          this.subscriptionService.add(getOneEstate);

        }
      });
    }, 2000)
  }

  checkEstateDetail() {
    this.estateService.getEstateDetailbyEstateId(this.sharedService.estateId)
      .subscribe(
        Response => {
          if (Response != null) {
            this.estateDetail = Response;
          } else {
            // If the estate detail is null, show the alert
            swal.fire({
              icon: 'info',
              title: 'Information',
              text: 'Please update Estate Profile in General',
            });
            this.router.navigateByUrl('/estate-detail/' + this.estate.id)
          }
        }
      )
  }

  getSales() {
    setTimeout(() => {
      const getSale = this.rubberSaleService.getSale()
        .subscribe(
          Response => {
            const rubberSales = Response
            this.filterSales = rubberSales.filter((e) => e.estateId == this.sharedService.estateId 
            && e.isActive == true 
            && e.paymentStatusId != 3 
            && e.letterOfConsentNo != '')
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

  print(sale: RubberSale) {

  }

  getPaymentStatus(sale: RubberSale): { status: string, color: string } {
    if (sale.paymentStatusId === 3) {
      return { status: 'Complete', color: 'green' };
    } else {
      return { status: 'In Process', color: '#c9c912' };
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  changeStatus(sale: RubberSale) {
    {
      swal.fire({
        title: "Are you sure to delete ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'Cancel'
      })
        .then((result) => {
          if (result.isConfirmed) {
            sale.isActive = false
            // const { paymentStatus, ...obj } = sale
            // const rubberSale:any = obj
            sale.paymentStatus = null
            this.rubberSaleService.updateSale(sale)
              .subscribe(
                Response => {
                  swal.fire({
                    title: 'Deleted!',
                    text: 'Rubber sale has been deleted!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                  });
                  this.ngOnInit()
                }
              )
          } else if (result.isDenied) {
          }
        })
    }

  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

}
