import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductionComparison } from '../_interface/productionComparison'
import { SharedService } from '../_services/shared.service';
import { ProductionComparisonService } from '../_services/production-comparison.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-production-comparison',
  templateUrl: './production-comparison.component.html',
  styleUrls: ['./production-comparison.component.css']
})
export class ProductionComparisonComponent {

  production: ProductionComparison = {} as ProductionComparison
  previousYear = 0
  currentYear = 0
  message = ''

  constructor(
    public dialog: MatDialogRef<ProductionComparison>,
    @Inject(MAT_DIALOG_DATA) public data: { data: number, previousYear: number },
    private sharedService: SharedService,
    private productComparisonService: ProductionComparisonService
  ) { }

  ngOnInit() {
    this.previousYear = 2010
    this.currentYear = 2011
    this.production.currentYearDry = this.data.data
    this.production.previousYearDry = this.data.previousYear
    if (this.production.currentYearDry < this.production.previousYearDry) {
      this.message = 'lower'
    }
    else if (this.production.currentYearDry > this.production.previousYearDry) {
      this.message = 'higher'
    }
  }

  addProductionComparison() {
    this.production.reason = this.production.reason || ''
    if (this.production.reason === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the reason',
      });
    }
    else {
      this.production.currentYear = this.currentYear.toString()
      this.production.previousYear = this.previousYear.toString()
      this.production.estateId = this.sharedService.estateId
      this.production.createdBy = this.sharedService.userId.toString()
      this.production.createdDate = new Date()
      this.production.productionComparison = this.message
      this.productComparisonService.addProductionComparison(this.production)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Production Comparison successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close()
          }
        )
    }
  }

  back() {
    this.dialog.close()
  }
}
