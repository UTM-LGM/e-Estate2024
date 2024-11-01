import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkerShortage } from 'src/app/_interface/workerShortage';
import { SharedService } from 'src/app/_services/shared.service';
import { WorkerShortageService } from 'src/app/_services/worker-shortage.service';
import swal from 'sweetalert2';
import { WorkerShortageDetailComponent } from '../worker-shortage-detail/worker-shortage-detail.component';
import { LaborInfoService } from 'src/app/_services/labor-info.service';
import { LaborInfo } from 'src/app/_interface/laborInfo';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { SpinnerService } from 'src/app/_services/spinner.service';


@Component({
  selector: 'app-worker-shortage',
  templateUrl: './worker-shortage.component.html',
  styleUrls: ['./worker-shortage.component.css']
})
export class WorkerShortageComponent implements OnInit, OnDestroy {

  @Output() backTabEvent = new EventEmitter<void>();
  @Input() selectedMonthYear = ''


  previousMonth = new Date()
  currentDate = new Date()

  filterWorkerShortage: WorkerShortage[] = []

  worker: WorkerShortage = {} as WorkerShortage

  date: any

  filterLabors: LaborInfo[] = []

  totalSumTapper = 0;
  totalSumField = 0;

  neededTapper = 0
  neededField = 0
  isSubmit = false

  constructor(
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private workerShortageService: WorkerShortageService,
    private dialog: MatDialog,
    private laborInfoService: LaborInfoService,
    private subscriptionService:SubscriptionService,
    private spinnerService:SpinnerService
  ) { }

  ngOnInit(): void {
    // this.getDate()
    this.worker.monthYear = this.selectedMonthYear
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonthYear']) {
      // Handle changes here if needed
      this.worker.monthYear = this.selectedMonthYear
      this.getWorkerShortage()
    }
  }

  // getDate() {
  //   this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
  //   this.worker.monthYear = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
  // }

  // monthSelected(month: string) {
  //   // this.worker.workerShortage = 0
  //   this.worker.tapperWorkerShortage = 0
  //   this.worker.fieldWorkerShortage = 0
  //   let monthDate = new Date(month)
  //   this.worker.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy')
  //   this.getWorkerShortage()
  // }

  futureMonth(): boolean {
    if (!this.worker.monthYear) {
      return false;
    }
    const selectedDate = new Date(this.worker.monthYear);
    if (selectedDate.getFullYear() < this.currentDate.getFullYear() ||
      (selectedDate.getFullYear() === this.currentDate.getFullYear() &&
        selectedDate.getMonth() < this.currentDate.getMonth())) {
      return true
    } else {
      return false
    }
  }

  add() {
    // this.date = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
    this.spinnerService.requestStarted()
    this.worker.estateId = this.sharedService.estateId
    this.worker.createdBy = this.sharedService.userId.toString()
    this.worker.createdDate = new Date()
    this.worker.monthYear = this.worker.monthYear
    this.isSubmit = true
    this.workerShortageService.addWorkerShortage(this.worker)
      .subscribe(
        {
          next: (Response) => {
            this.spinnerService.requestEnded()
            swal.fire({
              title: 'Done!',
              text: 'Worker Shortage successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.getWorkerShortage()
            this.isSubmit = false
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

  getWorkerShortage() {
    const getWorkerShortage = this.workerShortageService.getWorkerShortage()
      .subscribe(
        Response => {
          const worker = Response
          this.filterWorkerShortage = worker.filter(x => x.monthYear == this.worker.monthYear?.toUpperCase() && x.estateId == this.sharedService.estateId)
          this.getLabor()
        }
      )
      this.subscriptionService.add(getWorkerShortage);
  }

  update(worker: WorkerShortage) {
    const dialogRef = this.dialog.open(WorkerShortageDetailComponent, {
      data: { data: worker },
    })

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getWorkerShortage()
          this.sumNeeded()
        }
      )
  }

  back() {
    this.backTabEvent.emit();
  }

  getLabor() {
    this.totalSumTapper = 0
    this.totalSumField = 0
    const getLabor = this.laborInfoService.getLabor()
      .subscribe(
        Response => {
          const labors = Response
          this.filterLabors = labors.filter(e => e.monthYear == this.worker.monthYear?.toUpperCase() && e.estateId == this.sharedService.estateId)
          if (this.filterLabors.length > 0) {
            this.sumCurrent(this.filterLabors)
            this.sumNeeded()
          }
        });
      this.subscriptionService.add(getLabor);

  }

  sumCurrent(row: LaborInfo[]) {
    row.forEach((x: any) => {
      x.totalTapper = (x.tapperCheckrole || 0) + (x.tapperContractor || 0);
      this.totalSumTapper += x.totalTapper;
    });

    row.forEach((x: any) => {
      x.totalField = (x.fieldCheckrole || 0) + (x.fieldContractor || 0);
      this.totalSumField += x.totalField;
    });
  }

  sumNeeded() {
    const tapperWorkerShortages = this.filterWorkerShortage.map(worker => worker.tapperWorkerShortage);
    const fieldWorkerShortages = this.filterWorkerShortage.map(worker => worker.fieldWorkerShortage);
    this.neededTapper = this.totalSumTapper + tapperWorkerShortages[0]
    this.neededField = this.totalSumField + fieldWorkerShortages[0]
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
