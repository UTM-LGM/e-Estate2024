import { Component, OnInit } from '@angular/core';
import { RubberPurchase } from '../_interface/rubberPurchase';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RubberPurchaseDetailComponent } from '../rubber-purchase-detail/rubber-purchase-detail.component';
import { ActivatedRoute } from '@angular/router';
import { Estate } from '../_interface/estate';
import { RubberPurchaseService } from '../_services/rubber-purchase.service';
import { EstateService } from '../_services/estate.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-rubber-purchase',
  templateUrl: './rubber-purchase.component.html',
  styleUrls: ['./rubber-purchase.component.css']
})
export class RubberPurchaseComponent implements OnInit {
  
  term = ''
  pageNumber = 1
  isLoading = true

  estate: Estate = {} as Estate

  filterPurchase: RubberPurchase[] = []

  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'date', displayText: 'Date' },
    { columnName: 'sellerName', displayText: 'Seller Name' },
    { columnName: 'project', displayText: 'Project' },
    { columnName: 'rubberType', displayText: 'Rubber Type' },
    { columnName: 'authorizationLetter', displayText: 'Authorization Letter' },
    { columnName: 'weight', displayText: 'Weight (Kg)' },
    { columnName: 'drc', displayText: 'DRC (%)' },
    { columnName: 'price', displayText: 'Price (RM/Kg)' },
    { columnName: 'totalPrice', displayText: 'Total Price (RM)' }
  ];

  constructor(
    private rubberPurchaseService: RubberPurchaseService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private estateService: EstateService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getEstate()
    this.getPurchase()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.estateService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.isLoading = false
              });
      this.subscriptionService.add(getOneEstate);

        }
      });
    }, 2000)
  }

  getPurchase() {
    setTimeout(() => {
      const getPurchase = this.rubberPurchaseService.getPurchase()
        .subscribe(
          Response => {
            const rubberPurchase = Response
            this.filterPurchase = rubberPurchase.filter((e) => e.companyId == this.sharedService.companyId && e.estateId == this.sharedService.estateId)
            this.isLoading = false
          });
      this.subscriptionService.add(getPurchase);

    }, 2000)
  }

  status(purchase: RubberPurchase) {
    purchase.updatedBy = this.sharedService.userId.toString()
    purchase.updatedDate = new Date()
    purchase.isActive = !purchase.isActive
    this.rubberPurchaseService.updatePurchase(purchase)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Purchase Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      );
  }

  openDialog(purchase: RubberPurchase): void {
    const dialogRef = this.dialog.open(RubberPurchaseDetailComponent, {
      data: { data: purchase },
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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  

}
