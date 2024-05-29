import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from 'src/app/_interface/state';
import { SharedService } from 'src/app/_services/shared.service';
import { StateService } from 'src/app/_services/state.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
})
export class StateComponent implements OnInit, OnDestroy {
  state: State = {} as State

  states: State[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'state', displayText: 'State Name' },
  ];

  constructor(
    private stateService: StateService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getState()
    this.state.state = ''
  }

  submit() {
    if (this.state.state === '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.states.some(s => s.state.toLowerCase() === this.state.state.toLowerCase())) {
      swal.fire({
        text: 'State already exists!',
        icon: 'error'
      });
    } else {
      this.state.isActive = true
      this.state.createdBy = this.sharedService.userId.toString()
      this.state.createdDate = new Date()
      this.stateService.addState(this.state)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'State successfully submitted!',
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
    this.state = {} as State
  }

  getState() {
    setTimeout(() => {
      const getState = this.stateService.getState()
        .subscribe(
          Response => {
            this.states = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getState);
    }, 2000)
  }

  status(state: State) {
    state.updatedBy = this.sharedService.userId.toString()
    state.updatedDate = new Date()
    state.isActive = !state.isActive
    this.stateService.updateState(state)
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
