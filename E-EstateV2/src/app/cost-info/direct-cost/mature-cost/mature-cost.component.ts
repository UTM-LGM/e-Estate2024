import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Cost } from 'src/app/_interface/cost';
import { CostAmount } from 'src/app/_interface/costAmount';
import { CostAmountService } from 'src/app/_services/cost-amount.service';
import { CostService } from 'src/app/_services/cost.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-mature-cost',
  templateUrl: './mature-cost.component.html',
  styleUrls: ['./mature-cost.component.css']
})
export class MatureCostComponent implements OnInit {

  @Input() costTypeId: number = 0
  @Input() selectedYear = ''

  matureDirectCostAmount: CostAmount[] = []
  filterMatureDirectCostAmount: CostAmount[] = []
  draftFilterMatureDirectCostAmount: any[] = []
  submitFilterMatureDirectCostAmount: CostAmount[] = []
  costMatureAmount: CostAmount[] = []
  value: CostAmount[] = []

  result: number[] = []

  subCategories1: Cost[] = []
  costCategories: Cost[] = []

  filterId: any
  filterId1: any
  matureYear = ''
  totalMatureCostAmount = 0
  totalMatureAmount = 0
  isLoading = true
  isDisable = true

  constructor(
    private costService: CostService,
    private costAmountService: CostAmountService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.matureYear = this.selectedYear
    if (this.matureYear != '') {
      this.isDisable = false
    }
    this.getCostCategory()
    this.getCostSub1()
    this.getMatureDirectCost()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear']) {
      this.ngOnInit()
    }
  }

  getCostCategory() {
    setTimeout(() => {
      this.costService.getDirectMatureCostCategory()
        .subscribe(
          Response => {
            this.costCategories = Response
            this.isLoading = false
          });
    }, 1000)
  }

  getCostSub1() {
    this.costService.getDirectMatureSubCategory()
      .subscribe(
        Response => {
          this.subCategories1 = Response
          this.subCategories1.forEach(sub => sub.amount = 0);
        })
  }

  getMatureDirectCost() {
    this.costAmountService.getCostAmount()
      .subscribe(
        Response => {
          this.matureDirectCostAmount = Response
          this.filterMatureDirectCostAmount = this.matureDirectCostAmount.filter(x => x.year === parseInt(this.matureYear)
            && x.costTypeId == this.costTypeId && x.isMature === true)
          this.draftFilterMatureDirectCostAmount = this.filterMatureDirectCostAmount
            .filter(x => x.status === "Draft" && x.estateId == this.sharedService.estateId)
            .map(item => ({ ...item, amount: Number(item.amount).toFixed(2) }));
          this.submitFilterMatureDirectCostAmount = this.filterMatureDirectCostAmount.filter(x => x.status === "Submitted" && x.estateId == this.sharedService.estateId)
          console.log(this.submitFilterMatureDirectCostAmount)
          this.totalMatureCost(this.filterMatureDirectCostAmount)
        }
      )
  }

  totalMatureCost(data: CostAmount[]) {
    this.value = data
    this.totalMatureCostAmount = this.value.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0)
  }

  calculateDraftAmount() {
    this.draftFilterMatureDirectCostAmount.forEach(item => {
      item.amount = parseFloat(item.amount).toFixed(2);
    });
    this.totalMatureCostAmount = this.draftFilterMatureDirectCostAmount.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  }

  calculateTotalMatureAmount() {
    this.totalMatureAmount = this.subCategories1.reduce((acc, item) => acc + (item.amount || 0), 0)
  }

  addMatureCost() {
    let newArray = this.subCategories1.map((obj) => {
      return {
        ...obj,
        year: parseInt(this.selectedYear),
        estateId: this.sharedService.estateId,
        status: 'Draft',
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date()
      };
    });
    this.subCategories1 = newArray
    this.costMatureAmount = this.subCategories1.map(({ amount, id, year, estateId, status, createdBy, createdDate }) => ({ amount, costID: id, year, estateId: estateId, status, createdBy, createdDate })) as unknown as CostAmount[]
    if (this.costMatureAmount.length != 0) {
      this.costAmountService.addCostAmount(this.costMatureAmount)
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
              this.getMatureDirectCost();
            },
            error: (err) => {
              swal.fire({
                text: 'Please fil up the form',
                icon: 'error'
              });
            }
          })
    }
    else {
      swal.fire({
        text: 'Please fil up utility to create the form',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  }

  save() {
    this.costAmountService.updateCostAmount(this.draftFilterMatureDirectCostAmount)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Cost amount successfully saved!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getMatureDirectCost();
        }
      )
  }

  submitMatureCost() {
    const updatedBy = this.sharedService.userId.toString()
    const date = new Date()
    const updatedArray = this.draftFilterMatureDirectCostAmount.map(obj => {
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
                }),
                  this.getMatureDirectCost()
              }
            )
        }
      })
  }

  getRowCount(costSubcategory1: string) {
    return this.filterMatureDirectCostAmount.filter(amount => amount.costSubcategory1 === costSubcategory1).length
  }

  getRowCount1(costSubcategory1: string) {
    if (costSubcategory1 != null) {
      return this.subCategories1.filter(amount => amount.costSubcategory1 === costSubcategory1).length
    }
    else {
      return
    }
  }



}
