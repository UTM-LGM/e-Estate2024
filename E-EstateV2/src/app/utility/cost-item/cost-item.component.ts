import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cost } from 'src/app/_interface/cost';
import { CostCategory } from 'src/app/_interface/costCategory';
import { CostSubcategory1 } from 'src/app/_interface/costSubcategory1';
import { CostSubcategory2 } from 'src/app/_interface/costSubcategory2';
import { CostType } from 'src/app/_interface/costType';
import { CostCategoryService } from 'src/app/_services/cost-category.service';
import { CostItemService } from 'src/app/_services/cost-item.service';
import { CostSubcategory1Service } from 'src/app/_services/cost-subcategory1.service';
import { CostSubcategory2Service } from 'src/app/_services/cost-subcategory2.service';
import { CostTypeService } from 'src/app/_services/cost-type.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cost-item',
  templateUrl: './cost-item.component.html',
  styleUrls: ['./cost-item.component.css'],
})
export class CostItemComponent implements OnInit, OnDestroy {
  cost: Cost = {} as Cost
  filteredCost: any = {}

  filterCostTypes: CostType[] = []

  filterCostCategories: CostCategory[] = []

  filterCostSubs1: CostSubcategory1[] = []

  filterCostSubs2: CostSubcategory2[] = []

  costItem: Cost[] = []

  isLoading = true
  pageNumber = 1
  term = ''
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'costTypes', displayText: 'Cost Type' },
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'costCategory', displayText: 'Cost Category' },
    { columnName: 'costSubcategory1', displayText: 'Cost Subcategory 1' },
    { columnName: 'costSubcategory2', displayText: 'Cost Subcategory 2' },
  ];

  constructor(
    private costTypeService: CostTypeService,
    private costCategoryService: CostCategoryService,
    private costSubCategory1Service: CostSubcategory1Service,
    private costSubCategory2Service: CostSubcategory2Service,
    private costItemService: CostItemService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getCostType()
    this.getCostCategory()
    this.getCostSub1()
    this.getCostSub2()
    this.getCostItem()
  }

  initialForm() {
    this.cost.costTypeId = 0
    this.cost.costCategoryId = 0
    this.cost.costSubcategory1Id = 0
    this.cost.costSubcategory2Id = 0
  }

  submit() {
    this.cost.isActive = true
    this.cost.createdBy = this.sharedService.userId.toString()
    this.cost.createdDate = new Date()
    this.costItemService.addCostItem(this.cost)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Cost Item successfully submitted!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.cost = {} as Cost
          this.ngOnInit()
        });
  }

  getCostType() {
    const getCostType = this.costTypeService.getCostType()
      .subscribe(
        Response => {
          const costTypes = Response
          this.filterCostTypes = costTypes.filter((e) => e.isActive == true)
        });
      this.subscriptionService.add(getCostType);

  }

  getCostCategory() {
    const getCategory = this.costCategoryService.getCostCategory()
      .subscribe(
        Response => {
          const costCategories = Response
          this.filterCostCategories = costCategories.filter(e => e.isActive == true)
        });
      this.subscriptionService.add(getCategory);

  }

  getCostSub1() {
    const getSubCategory = this.costSubCategory1Service.getCostSubCategory()
      .subscribe(
        Response => {
          const costSubs1 = Response
          this.filterCostSubs1 = costSubs1.filter((e) => e.isActive == true)
        });
      this.subscriptionService.add(getSubCategory);

  }

  getCostSub2() {
    const getSubCategory = this.costSubCategory2Service.getCostSubCategory()
      .subscribe(
        Response => {
          const costSubs2 = Response
          this.filterCostSubs2 = costSubs2.filter((e) => e.isActive == true)
        });
      this.subscriptionService.add(getSubCategory);

  }

  getCostItem() {
    setTimeout(() => {
      const getCostItem = this.costItemService.getCostItem()
        .subscribe(
          Response => {
            this.costItem = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getCostItem);

    }, 2000)
  }

  status(cost: Cost) {
    cost.updatedBy = this.sharedService.userId.toString()
    cost.updatedDate = new Date()
    cost.isActive = !cost.isActive
    const { costCategory, costSubcategory1, costSubcategory2, ...newFields } = cost
    this.filteredCost = newFields
    this.costItemService.updateCostItem(this.filteredCost)
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
      );
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
