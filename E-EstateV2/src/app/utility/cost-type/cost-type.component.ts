import { Component, OnDestroy, OnInit } from '@angular/core';
import { CostType } from 'src/app/_interface/costType';
import { CostTypeService } from 'src/app/_services/cost-type.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cost-type',
  templateUrl: './cost-type.component.html',
  styleUrls: ['./cost-type.component.css']
})
export class CostTypeComponent implements OnInit, OnDestroy {
  term = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'costType', displayText: 'Cost Type' },
  ];

  costType: CostType = {} as CostType

  costTypes: CostType[] = []

  constructor(
    private costTypeService: CostTypeService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.getCostType()
    this.costType.costType = ''
  }

  submit() {
    if (this.costType.costType === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.costTypes.some(s => s.costType.toLowerCase() === this.costType.costType.toLowerCase())) {
      swal.fire({
        text: 'Cost Type already exists!',
        icon: 'error'
      });
    }
    else {
      this.costType.isActive = true
      this.costType.createdBy = this.sharedService.userId.toString()
      this.costType.createdDate = new Date()
      this.costTypeService.addCostType(this.costType)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Cost Type successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          })
    }
  }

  reset() {
    this.costType = {} as CostType
  }

  status(cost: CostType) {
    cost.updatedBy = this.sharedService.userId.toString()
    cost.updatedDate = new Date()
    cost.isActive = !cost.isActive
    this.costTypeService.updateCostType(cost)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      )
  }

  getCostType() {
    setTimeout(() => {
      const getCostType = this.costTypeService.getCostType()
        .subscribe(
          Response => {
            this.costTypes = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getCostType);

    }, 2000)
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
