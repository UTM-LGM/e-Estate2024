import { Component, OnDestroy, OnInit } from '@angular/core';
import { TappingSystem } from 'src/app/_interface/tappingSystem';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { TappingSystemService } from 'src/app/_services/tapping-system.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tapping-system',
  templateUrl: './tapping-system.component.html',
  styleUrls: ['./tapping-system.component.css']
})
export class TappingSystemComponent implements OnInit, OnDestroy {

  tappingSystem: TappingSystem = {} as TappingSystem
  tappingSystems: TappingSystem[] = []

  isLoading = true
  term = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1

  itemsPerPage = 10

  sortableColumns = [
    { columnName: 'tappingSystem', displayText: 'Tapping System' },
  ];

  constructor(
    private tappingSystemService: TappingSystemService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.tappingSystem.tappingSystem = ''
    this.getTappingSystem()
  }

  submit() {
    if (this.tappingSystem.tappingSystem === '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.tappingSystems.some(s => s.tappingSystem.toLowerCase() === this.tappingSystem.tappingSystem.toLowerCase())) {
      swal.fire({
        text: 'Tapping system already exists!',
        icon: 'error'
      });
    } else {
      this.tappingSystem.isActive = true
      this.tappingSystem.createdBy = this.sharedService.userId.toString()
      this.tappingSystem.createdDate = new Date()
      this.tappingSystemService.addTappingSystem(this.tappingSystem)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Tapping system successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          });
    }
  }

  reset() {
    this.tappingSystem = {} as TappingSystem
  }

  getTappingSystem() {
    setTimeout(() => {
      const getTappingSystem = this.tappingSystemService.getTappingSystem()
        .subscribe(
          Response => {
            this.tappingSystems = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getTappingSystem);
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

  status(tappingSystem: TappingSystem) {
    tappingSystem.updatedBy = this.sharedService.userId.toString()
    tappingSystem.updatedDate = new Date()
    tappingSystem.isActive = !tappingSystem.isActive
    this.tappingSystemService.updateTappingSystem(tappingSystem)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Tapping system successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  calculateIndex(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }

  onPageChange(newPageNumber: number) {
    if (newPageNumber < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = newPageNumber;
    }
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

}
