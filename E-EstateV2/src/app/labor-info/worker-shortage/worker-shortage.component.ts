import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkerShortage } from 'src/app/_interface/workerShortage';
import { SharedService } from 'src/app/_services/shared.service';
import { WorkerShortageService } from 'src/app/_services/worker-shortage.service';
import swal from 'sweetalert2';
import { WorkerShortageDetailComponent } from '../worker-shortage-detail/worker-shortage-detail.component';


@Component({
  selector: 'app-worker-shortage',
  templateUrl: './worker-shortage.component.html',
  styleUrls: ['./worker-shortage.component.css']
})
export class WorkerShortageComponent implements OnInit{

  previousMonth = new Date()
  currentDate = new Date()

  filterWorkerShortage:WorkerShortage[]=[]

  worker: WorkerShortage = {} as WorkerShortage

  constructor(
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private workerShortageService:WorkerShortageService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getDate()
    this.getWorkerShortage()
  }

  getDate() {
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
    this.worker.monthYear = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
  }
  
  monthSelected(month: string) {
    this.worker.workerShortage = 0
    let monthDate = new Date(month)
    this.worker.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy')
    this.getWorkerShortage()
  }

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

  add(){
    this.worker.estateId = this.sharedService.estateId
    this.worker.createdBy = this.sharedService.userId.toString()
    this.worker.createdDate = new Date()
    this.workerShortageService.addWorkerShortage(this.worker)
    .subscribe(
      {
        next:(Response)=>{
          swal.fire({
            title: 'Done!',
            text: 'Worker Shortage successfully submitted!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.getWorkerShortage()
        },
        error:(err)=>{
          swal.fire({
            text: 'Please fil up the form',
            icon: 'error'
          });
        }
      }
    )
  }

  getWorkerShortage(){
    this.workerShortageService.getWorkerShortage()
    .subscribe(
      Response =>{
        const worker = Response
        this.filterWorkerShortage = worker.filter(x => x.monthYear == this.worker.monthYear && x.estateId == this.sharedService.estateId)
      }
    )
  }

  update(worker:WorkerShortage){
    const dialogRef = this.dialog.open(WorkerShortageDetailComponent,{
      data:{data:worker},
    })

    dialogRef.afterClosed()
    .subscribe(
      Response =>{
        this.getWorkerShortage()
      }
    )
  }
}
