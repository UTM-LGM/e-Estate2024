import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Cost } from 'src/app/_interface/cost';
import { CostAmount } from 'src/app/_interface/costAmount';
import { CostAmountService } from 'src/app/_services/cost-amount.service';
import { CostService } from 'src/app/_services/cost.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-indirect-cost',
  templateUrl: './indirect-cost.component.html',
  styleUrls: ['./indirect-cost.component.css'],
})
export class IndirectCostComponent implements OnInit,OnDestroy {

  @Input() costTypeId = 0
  @Input() selectedMonthYear = ''

  term = ''

  indirectCosts: Cost[] = []

  costAmount: CostAmount[] = []
  indirectCostAmount: CostAmount[] = []
  filterIndirectCostAmount: CostAmount[] = []
  draftFilterIndirectCostAmount: any[] = []
  submitFilterIndirectCostAmount: CostAmount[] = []

  value: CostAmount[] = []

  indirectCost = {} as Cost
  cost = {} as Cost

  totalAmount = 0
  totalCostAmount = 0

  isLoading = true
  isDisable = true

  constructor(
    private costService: CostService,
    private costAmountService: CostAmountService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService,
    private spinnerService:SpinnerService
  ) { }

  ngOnInit() {
    if (this.selectedMonthYear != '') {
      this.isDisable = false
    }
    this.getIndirectCost()
    this.getIndirectCostAmount()

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonthYear']) {
      this.ngOnInit()
    }
  }

  getIndirectCost() {
    setTimeout(() => {
      const getIndirectCost = this.costService.getIndirectCost(this.costTypeId)
        .subscribe(
          Response => {
            this.indirectCosts = Response
            this.indirectCosts.forEach(sub => sub.amount = 0)
            this.isLoading = false
          });
      this.subscriptionService.add(getIndirectCost);

    }, 1000)
  }

  totalCost(data: CostAmount[]) {
    this.value = data
    this.totalCostAmount = this.value.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0)
  }

  calculateDraftAmount() {
    this.draftFilterIndirectCostAmount.forEach(item => {
      item.amount = parseFloat(item.amount).toFixed(2);
    });
    this.totalCostAmount = this.draftFilterIndirectCostAmount.reduce((acc, item) => acc + parseFloat(item.amount), 0)
  }

  calculateTotalAmount() {
    this.totalAmount = this.indirectCosts.reduce((acc, cost) => acc + (cost.amount || 0), 0)
  }

  getIndirectCostAmount() {
    const getCostAmount = this.costAmountService.getCostAmount()
      .subscribe(
        Response => {
          this.indirectCostAmount = Response;
          this.filterIndirectCostAmount = this.indirectCostAmount.filter(x => x.monthYear === this.selectedMonthYear.toUpperCase() && x.costTypeId == this.costTypeId && x.estateId == this.sharedService.estateId)
          this.draftFilterIndirectCostAmount = this.filterIndirectCostAmount.filter(x => x.status === "DRAFT" && x.estateId == this.sharedService.estateId)
            .map(item => ({ ...item, amount: Number(item.amount).toFixed(2) }))
          this.submitFilterIndirectCostAmount = this.filterIndirectCostAmount.filter(x => x.status === "SUBMITTED" && x.estateId == this.sharedService.estateId)
          this.totalCost(this.filterIndirectCostAmount)
        }
      )
      this.subscriptionService.add(getCostAmount);
    
  }

  add() {
    let newArray = this.indirectCosts.map((obj) => {
      return {
        ...obj,
        monthYear: this.selectedMonthYear,
        estateId: this.sharedService.estateId,
        status: 'DRAFT',
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date()
      };
    });
    this.spinnerService.requestStarted()
    this.indirectCosts = newArray
    this.costAmount = this.indirectCosts.map(({ amount, id, monthYear, estateId, status, createdBy, createdDate }) => ({ amount, costID: id, monthYear, estateId, status, createdBy, createdDate })) as unknown as CostAmount[]
    this.costAmountService.addCostAmount(this.costAmount)
      .subscribe(
        {
          next: (Response) => {
            this.spinnerService.requestEnded()
            swal.fire({
              title: 'Done!',
              text: 'Cost amount successfully saved!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getIndirectCostAmount();
          },
          error: (err) => {
            this.spinnerService.requestEnded()
            swal.fire({
              text: 'Please fil up the form',
              icon: 'error'
            });
          }
        }
      )

  }

  save() {
    this.spinnerService.requestStarted()
    this.costAmountService.updateCostAmount(this.draftFilterIndirectCostAmount)
      .subscribe(
        Response => {
          this.spinnerService.requestEnded()
          swal.fire({
            title: 'Done!',
            text: 'Cost amount successfully saved!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getIndirectCostAmount();
        }
      )
  }

  submitIndirectCost() {
    const updatedBy = this.sharedService.userId.toString()
    const date = new Date()
    const updatedArray = this.draftFilterIndirectCostAmount.map(obj => {
      return { ...obj, status: 'SUBMITTED', updatedBy: updatedBy, updatedDate: date }
    });
    swal.fire({
      title: 'Are you sure to submit ? ',
      text: 'There is no editing after submission',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.spinnerService.requestStarted()
          this.costAmountService.updateCostAmount(updatedArray)
            .subscribe(
              Response => {
                this.spinnerService.requestEnded()
                swal.fire({
                  title: 'Done!',
                  text: 'Cost Amount successfully submitted!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
                this.getIndirectCostAmount()
              }
            )
        }
      })
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
