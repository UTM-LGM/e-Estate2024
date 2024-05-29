import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from 'src/app/_interface/state';
import { Town } from 'src/app/_interface/town';
import { SharedService } from 'src/app/_services/shared.service';
import { StateService } from 'src/app/_services/state.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { TownService } from 'src/app/_services/town.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.css'],
})
export class TownComponent implements OnInit, OnDestroy {
  
  town: Town = {} as Town
  fileteredTown: any = {}

  states: State[] = []

  towns: Town[] = []

  term = ''
  isLoading = true
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'state', displayText: 'State Name' },
    { columnName: 'town', displayText: 'Town' },
  ];

  constructor(
    private townService: TownService,
    private stateService: StateService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.town.stateId = 0
    this.getState()
    this.getTown()
  }

  submit() {
    if (this.towns.some(s => s.town.toLowerCase() === this.town.town.toLowerCase())) {
      swal.fire({
        text: 'Town already exists!',
        icon: 'error'
      });
    }
    else {
      this.town.isActive = true
      this.town.createdBy = this.sharedService.userId.toString()
      this.town.createdDate = new Date()
      this.townService.addTown(this.town)
        .subscribe(
          {
            next: (Response) => {
              swal.fire({
                title: 'Done!',
                text: 'Town successfully submitted!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
              this.reset()
              this.ngOnInit()
            },
            error: (err) => {
              swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill up the form',
              });
            }
          })
    }
  }

  reset() {
    this.town = {} as Town
  }

  getState() {
    const getState = this.stateService.getState()
      .subscribe(
        Response => {
          const states = Response
          this.states = states.filter(x => x.isActive == true)
        });
      this.subscriptionService.add(getState);
  }

  getTown() {
    setTimeout(() => {
      const getTown = this.townService.getTown()
        .subscribe(
          Response => {
            this.towns = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getTown);

    }, 2000)
  }

  status(town: Town) {
    town.updatedBy = this.sharedService.userId.toString()
    town.updatedDate = new Date()
    town.isActive = !town.isActive
    const { state, ...newFields } = town
    this.fileteredTown = newFields
    this.townService.updateTown(this.fileteredTown)
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
