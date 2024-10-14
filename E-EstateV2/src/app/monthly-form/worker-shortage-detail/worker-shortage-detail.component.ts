import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkerShortage } from 'src/app/_interface/workerShortage';
import { WorkerShortageComponent } from '../worker-shortage/worker-shortage.component';
import { SharedService } from 'src/app/_services/shared.service';
import { WorkerShortageService } from 'src/app/_services/worker-shortage.service';
import swal from 'sweetalert2';
import { SpinnerService } from 'src/app/_services/spinner.service';


@Component({
  selector: 'app-worker-shortage-detail',
  templateUrl: './worker-shortage-detail.component.html',
  styleUrls: ['./worker-shortage-detail.component.css']
})
export class WorkerShortageDetailComponent implements OnInit {

  worker: WorkerShortage = {} as WorkerShortage

  constructor(
    public dialogRef: MatDialogRef<WorkerShortageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: WorkerShortage },
    private sharedService: SharedService,
    private workerShortageService: WorkerShortageService,
    private spinnerService:SpinnerService
  ) { }

  ngOnInit(): void {
    this.worker = this.data.data
  }

  back() {
    this.dialogRef.close()
  }

  update() {
    this.spinnerService.requestStarted()
    this.worker.updatedBy = this.sharedService.userId.toString()
    this.worker.updatedDate = new Date()
    this.workerShortageService.updateWorkerShortage(this.worker)
      .subscribe(
        Response => {
          this.spinnerService.requestEnded()
          swal.fire({
            title: 'Done!',
            text: 'Worker Shortage successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )
  }
}
