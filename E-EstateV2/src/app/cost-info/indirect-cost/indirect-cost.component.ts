import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Cost } from 'src/app/_interface/cost';
import { CostAmount } from 'src/app/_interface/costAmount';
import { CostAmountService } from 'src/app/_services/cost-amount.service';
import { CostService } from 'src/app/_services/cost.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-indirect-cost',
  templateUrl: './indirect-cost.component.html',
  styleUrls: ['./indirect-cost.component.css'],
})
export class IndirectCostComponent implements OnInit,OnDestroy {

  @Input() costTypeId = 0
  @Input() selectedYear = ''

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
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    if (this.selectedYear != '') {
      this.isDisable = false
    }
    this.getIndirectCost()
    this.getIndirectCostAmount()

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear']) {
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
          this.filterIndirectCostAmount = this.indirectCostAmount.filter(x => x.year === parseInt(this.selectedYear) && x.costTypeId == this.costTypeId)
          this.draftFilterIndirectCostAmount = this.filterIndirectCostAmount.filter(x => x.status === "Draft" && x.estateId == this.sharedService.estateId)
            .map(item => ({ ...item, amount: Number(item.amount).toFixed(2) }))
          this.submitFilterIndirectCostAmount = this.filterIndirectCostAmount.filter(x => x.status === "Submitted" && x.estateId == this.sharedService.estateId)
          this.totalCost(this.filterIndirectCostAmount)
        }
      )
      this.subscriptionService.add(getCostAmount);
    
  }

  add() {
    let newArray = this.indirectCosts.map((obj) => {
      return {
        ...obj,
        year: parseInt(this.selectedYear),
        estateId: this.sharedService.estateId,
        status: 'Draft',
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date()
      };
    });
    this.indirectCosts = newArray
    this.costAmount = this.indirectCosts.map(({ amount, id, year, estateId, status, createdBy, createdDate }) => ({ amount, costID: id, year, estateId, status, createdBy, createdDate })) as unknown as CostAmount[]
    this.costAmountService.addCostAmount(this.costAmount)
      .subscribe(
        {
          next: (Response) => {
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
            swal.fire({
              text: 'Please fil up the form',
              icon: 'error'
            });
          }
        }
      )

  }

  save() {
    this.costAmountService.updateCostAmount(this.draftFilterIndirectCostAmount)
      .subscribe(
        Response => {
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
      return { ...obj, status: 'Submitted', updatedBy: updatedBy, updatedDate: date }
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
          this.costAmountService.updateCostAmount(updatedArray)
            .subscribe(
              Response => {
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
