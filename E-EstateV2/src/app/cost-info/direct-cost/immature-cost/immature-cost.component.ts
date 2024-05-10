import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Cost } from 'src/app/_interface/cost';
import { CostAmount } from 'src/app/_interface/costAmount';
import { CostAmountService } from 'src/app/_services/cost-amount.service';
import { CostService } from 'src/app/_services/cost.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-immature-cost',
  templateUrl: './immature-cost.component.html',
  styleUrls: ['./immature-cost.component.css']
})
export class ImmatureCostComponent implements OnInit {

  @Input() costTypeId: number = 0
  @Input() selectedYear = ''

  subCategories2IM: Cost[] = []

  costImmatureAmount: CostAmount[] = []
  immatureDirectCostAmount: CostAmount[] = []
  filterImmatureDirectCostAmount: CostAmount[] = []
  draftFilterImmatureDirectCostAmount: any[] = []
  submitFilterImmatureDirectCostAmount: CostAmount[] = []
  value: CostAmount[] = []

  yearSelectedImmature = false
  immatureYear = ''
  totalImmatureCostAmount = 0
  totalImmatureAmount = 0
  isLoading = true
  isDisable = true


  constructor(
    private costAmountService: CostAmountService,
    private costService: CostService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.immatureYear = this.selectedYear
    if (this.immatureYear != '') {
      this.isDisable = false
    }
    this.getImmatureCostSub()
    this.getImmatureDirectCost()

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear']) {
      this.ngOnInit()
    }
  }

  getImmatureCostSub() {
    setTimeout(() => {
      this.costService.getDirectImmatureSubCategory()
        .subscribe(
          Response => {
            this.subCategories2IM = Response
            this.subCategories2IM.forEach(sub => sub.amount = 0)
            this.isLoading = false
          });
    }, 1000)
  }

  getImmatureDirectCost() {
    this.costAmountService.getCostAmount()
      .subscribe(
        Response => {
          this.immatureDirectCostAmount = Response
          this.filterImmatureDirectCostAmount = this.immatureDirectCostAmount.filter(x => x.year === parseInt(this.immatureYear)
            && x.costTypeId == this.costTypeId && x.isMature === false && x.isMature !== null)
          this.draftFilterImmatureDirectCostAmount = this.filterImmatureDirectCostAmount.filter(x => x.status === "Draft" && x.estateId == this.sharedService.estateId)
            .map(item => ({ ...item, amount: Number(item.amount).toFixed(2) }))
          this.submitFilterImmatureDirectCostAmount = this.filterImmatureDirectCostAmount.filter(x => x.status === "Submitted" && x.estateId == this.sharedService.estateId)
          this.totalImmatureCost(this.filterImmatureDirectCostAmount)
        }
      )
  }

  totalImmatureCost(data: CostAmount[]) {
    this.value = data
    this.totalImmatureCostAmount = this.value.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0)
  }

  calculateDraftAmount() {
    this.draftFilterImmatureDirectCostAmount.forEach(item => {
      item.amount = parseFloat(item.amount).toFixed(2);
    })
    this.totalImmatureCostAmount = this.draftFilterImmatureDirectCostAmount.reduce((acc, item) => acc + parseFloat(item.amount), 0)
  }

  addImmmatureCost() {
    let newArray = this.subCategories2IM.map(obj => {
      return {
        ...obj,
        year: parseInt(this.selectedYear),
        estateId: this.sharedService.estateId,
        status: 'Draft',
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date()
      };
    });
    this.subCategories2IM = newArray
    this.costImmatureAmount = this.subCategories2IM.map(({ amount, id, year, estateId, status, createdBy, createdDate }) => ({ amount, costID: id, year, estateId: estateId, status, createdBy, createdDate })) as unknown as CostAmount[];
    this.costAmountService.addCostAmount(this.costImmatureAmount)
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
            this.getImmatureDirectCost();
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

  calculateTotalImmatureAmount() {
    this.totalImmatureAmount = this.subCategories2IM.reduce((acc, item) => acc + (item.amount || 0), 0)
  }

  save() {
    this.costAmountService.updateCostAmount(this.draftFilterImmatureDirectCostAmount)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Cost amount successfully saved!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getImmatureDirectCost();
        }
      )
  }

  submitImmatureCost() {
    const updatedBy = this.sharedService.userId.toString()
    const date = new Date()
    const updatedArray = this.draftFilterImmatureDirectCostAmount.map(obj => {
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
                this.getImmatureDirectCost()
              }
            )
        }
      })
  }

}
