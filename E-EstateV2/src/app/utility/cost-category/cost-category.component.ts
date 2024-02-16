import { Component, OnInit } from '@angular/core';
import { CostCategory } from 'src/app/_interface/costCategory';
import { CostSubcategory1 } from 'src/app/_interface/costSubcategory1';
import { CostSubcategory2 } from 'src/app/_interface/costSubcategory2';
import { CostCategoryService } from 'src/app/_services/cost-category.service';
import { CostSubcategory1Service } from 'src/app/_services/cost-subcategory1.service';
import { CostSubcategory2Service } from 'src/app/_services/cost-subcategory2.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cost-category',
  templateUrl: './cost-category.component.html',
  styleUrls: ['./cost-category.component.css'],
})
export class CostCategoryComponent implements OnInit {
  costCategory = {} as CostCategory
  costSubcategory1 = {} as CostSubcategory1
  costSubcategory2 = {} as CostSubcategory2

  costCategories: CostCategory[] = []
  costSubCategories1: CostSubcategory1[] = []
  costSubCategories2: CostSubcategory2[] = []

  term = ''
  isLoading = true
  pageNumber1 = 1
  pageNumber2 = 1
  pageNumber3 = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns1 = [
    { columnName: 'costCategory', displayText: 'Cost Category' },
  ];
  sortableColumns2 = [
    { columnName: 'costSubcategory1', displayText: 'Subcategory 1' },
  ];
  sortableColumns3 = [
    { columnName: 'costSubcategory2', displayText: 'Subcategory 2' },
  ];

  constructor(
    private costCategoryService: CostCategoryService,
    private costSubCategory1Service: CostSubcategory1Service,
    private costSubCategory2Service: CostSubcategory2Service,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getCostCategory()
    this.getCostSub1()
    this.getCostSub2()
    this.costCategory.costCategory = ''
    this.costSubcategory1.costSubcategory1 = ''
    this.costSubcategory2.costSubcategory2 = ''
  }

  getCostCategory() {
    setTimeout(() => {
      this.costCategoryService.getCostCategory()
        .subscribe(
          Response => {
            this.costCategories = Response
            this.isLoading = false
          });
    }, 2000)
  }

  getCostSub1() {
    setTimeout(() => {
      this.costSubCategory1Service.getCostSubCategory()
        .subscribe(
          Response => {
            this.costSubCategories1 = Response
            this.isLoading = false
          });
    }, 2000)
  }

  getCostSub2() {
    setTimeout(() => {
      this.costSubCategory2Service.getCostSubCategory()
        .subscribe(
          Response => {
            this.costSubCategories2 = Response
            this.isLoading = false
          });
    }, 2000)
  }

  submitCategory() {
    if (this.costCategory.costCategory === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up Cost Category',
      });
    } else if (this.costCategories.some(s => s.costCategory.toLowerCase() === this.costCategory.costCategory.toLowerCase())) {
      swal.fire({
        text: 'Cost Category already exists!',
        icon: 'error'
      });
    }
    else {
      this.costCategory.isActive = true
      this.costCategory.createdBy = this.sharedService.userId.toString()
      this.costCategory.createdDate = new Date()
      this.costCategoryService.addCostCategory(this.costCategory)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Cost category successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.costCategory = {} as CostCategory
            this.ngOnInit()
          });
    }

  }

  submitSub1() {
    if (this.costSubcategory1.costSubcategory1 === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up Cost Subcategory 1',
      });
    } else if (this.costSubCategories1.some(s => s.costSubcategory1.toLowerCase() === this.costSubcategory1.costSubcategory1.toLowerCase())) {
      swal.fire({
        text: 'Cost Subcategory 1 already exists!',
        icon: 'error'
      });
    }
    else {
      this.costSubcategory1.isActive = true
      this.costSubcategory1.createdBy = this.sharedService.userId.toString()
      this.costSubcategory1.createdDate = new Date()
      this.costSubCategory1Service.addCostSubCategory(this.costSubcategory1)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Cost Subcategory 1 successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.costSubcategory1 = {} as CostSubcategory1
            this.ngOnInit()
          });
    }
  }

  submitSub2() {
    if (this.costSubcategory2.costSubcategory2 === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up Cost Subcategory 2',
      });
    } else if (this.costSubCategories2.some(s => s.costSubcategory2.toLowerCase() === this.costSubcategory2.costSubcategory2.toLowerCase())) {
      swal.fire({
        text: 'Cost Subcategory 2 already exists!',
        icon: 'error'
      });
    }
    else {
      this.costSubcategory2.isActive = true
      this.costSubcategory2.createdBy = this.sharedService.userId.toString()
      this.costSubcategory2.createdDate = new Date()
      this.costSubCategory2Service.addCostSubCategory(this.costSubcategory2)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Cost Subcategory 2 successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });

            this.costSubcategory2 = {} as CostSubcategory2
            this.ngOnInit()
          });
    }
  }

  statusCostCategory(costCategories: CostCategory) {
    costCategories.updatedBy = this.sharedService.userId.toString()
    costCategories.updatedDate = new Date()
    costCategories.isActive = !costCategories.isActive
    this.costCategoryService.updateCategory(costCategories)
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

  statusCostSub1(costSubCategories1: CostSubcategory1) {
    costSubCategories1.updatedBy = this.sharedService.userId.toString()
    costSubCategories1.updatedDate = new Date()
    costSubCategories1.isActive = !costSubCategories1.isActive
    this.costSubCategory1Service.updateCostSub1(costSubCategories1)
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

  statusCostSub2(costSubCategories2: CostSubcategory2) {
    costSubCategories2.updatedBy = this.sharedService.userId.toString()
    costSubCategories2.updatedDate = new Date()
    costSubCategories2.isActive = !costSubCategories2.isActive
    this.costSubCategory2Service.updateCostSub2(costSubCategories2)
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

}
