import { Component, OnInit } from '@angular/core';
import { RubberSale } from '../_interface/rubberSale';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RubberSaleDetailComponent } from '../rubber-sale-detail/rubber-sale-detail.component';
import { SharedService } from '../_services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Estate } from '../_interface/estate';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { EstateService } from '../_services/estate.service';

@Component({
  selector: 'app-rubber-sales',
  templateUrl: './rubber-sales.component.html',
  styleUrls: ['./rubber-sales.component.css']
})
export class RubberSalesComponent implements OnInit {
  term = ''
  pageNumber = 1
  isLoading = true

  estate: Estate = {} as Estate

  filterSales: RubberSale[] = []

  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'date', displayText: 'Date' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
    { columnName: 'rubberType', displayText: 'Rubber Type' },
    { columnName: 'authorizationLetter', displayText: 'Authorization Letter' },
    { columnName: 'receiptNo', displayText: 'Receipt No' },
    { columnName: 'weight', displayText: 'Weight (Kg)' },
    { columnName: 'drc', displayText: 'DRC (%)' },
    { columnName: 'amountPaid', displayText: 'Amount Paid (RM)' },
  ];

  constructor(
    private rubberSaleService: RubberSaleService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private estateService: EstateService
  ) { }

  ngOnInit() {
    this.getEstate()
    this.getSales()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          this.estateService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.isLoading = false
              });
        }
      });
    }, 2000)
  }

  getSales() {
    setTimeout(() => {
      this.rubberSaleService.getSale()
        .subscribe(
          Response => {
            const rubberSales = Response
            this.filterSales = rubberSales.filter((e) => e.companyId == this.sharedService.companyId && e.estateId == this.sharedService.estateId)
            this.isLoading = false
          })
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

}
