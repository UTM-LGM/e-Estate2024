import { Component, OnInit } from '@angular/core';
import { RubberSale } from '../_interface/rubberSale';
import { SubscriptionService } from '../_services/subscription.service';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-amend-rubber-sale',
  templateUrl: './amend-rubber-sale.component.html',
  styleUrls: ['./amend-rubber-sale.component.css']
})
export class AmendRubberSaleComponent implements OnInit {

  term = ''
  pageNumber = 1
  isLoading = true

  filterSales: any[] = []
  order = ''
  currentSortedColumn = ''
  estate: any = {} as any


  sortableColumns = [
    { columnName: 'date', displayText: 'Date' },
    { columnName: 'licenseNo', displayText: 'License No' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
    { columnName: 'rubberType', displayText: 'Rubber Type' },
    { columnName: 'letterOfConsentNo', displayText: 'Letter of Consent No (Form 1)' },
    { columnName: 'wetWeight', displayText: 'Wet Weight (Kg)' },
    { columnName: 'drc', displayText: 'DRC (%)' },
    { columnName: 'remark', displayText: 'Remark' },
    { columnName: 'isActive', displayText: 'Status' },

  ];

  constructor(
    private subscriptionService: SubscriptionService,
    private rubberSaleService: RubberSaleService,
    private myLesenService: MyLesenIntegrationService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getSales()
  }

  getSales() {
    setTimeout(() => {
      const getSale = this.rubberSaleService.getSale().subscribe(Response => {
        const rubberSales = Response;

        // Filter the sales
        this.filterSales = rubberSales.filter(e =>
          e.isActive === true && e.paymentStatusId !== 3
        );

        // Fetch estate info for each sale and attach it
        this.filterSales.forEach(sale => {
          this.myLesenService.getOneEstate(sale.estateId).subscribe(estateResponse => {
            sale.estate = estateResponse;  // ✅ attach estate directly to the sale object
            this.isLoading = false;
          });
        });

      });

      this.subscriptionService.add(getSale);
    }, 2000);
  }


  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }


  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }


  status(sale: RubberSale) {
    sale.updatedBy = this.sharedService.userId.toString()
    sale.updatedDate = new Date()
    sale.isActive = !sale.isActive
    const { paymentStatus, ...obj } = sale
    const filteredSale = obj
    this.rubberSaleService.updateSale(filteredSale)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Rubber Sale successfully updated!',
            icon: 'success',
            showConfirmButton: true
          });
          this.getSales()
        }
      )
  }


}
