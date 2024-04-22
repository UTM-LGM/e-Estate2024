import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalLabor } from 'src/app/_interface/localLabor';
import { LocalLaborType } from 'src/app/_interface/localLaborType';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';
import { LaborTypeService } from 'src/app/_services/labor-type.service';
import { LocalLaborService } from 'src/app/_services/local-labor.service';
import { LaborLocalDetailComponent } from '../labor-local-detail/labor-local-detail.component';

@Component({
  selector: 'app-labor-local',
  templateUrl: './labor-local.component.html',
  styleUrls: ['./labor-local.component.css']
})
export class LaborLocalComponent implements OnInit {

  labors: LocalLabor[] = []

  labor: LocalLabor = {} as LocalLabor

  previousMonth = new Date()
  currentDate = new Date()

  filterTypes: LocalLaborType[] = []

  filterLocalLabors: LocalLabor[] = []

  totalWorker = 0
  totalLocalWorker = 0

  constructor(
    private laborTypeService: LaborTypeService,
    private datePipe: DatePipe,
    private localLaborService: LocalLaborService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getDate()
    this.getLocalLabor()
    this.getLaborType()
  }

  getDate() {
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1)
    this.labor.monthYear = this.datePipe.transform(this.previousMonth, 'MMM-yyyy')
  }

  monthSelected(month: string) {
    let monthDate = new Date(month)
    this.labor.monthYear = this.datePipe.transform(monthDate, 'MMM-yyyy')
    this.getNewArray()
    this.getLocalLabor()
  }

  getNewArray() {
    let newArray = this.filterTypes.map((obj) => {
      return {
        ...obj,
        monthYear: this.labor.monthYear,
        estateId: this.sharedService.estateId,
        totalWorker: obj.totalWorker
      };
    });
    this.filterTypes = newArray
  }

  getLaborType() {
    this.laborTypeService.getType()
      .subscribe(
        Response => {
          const types = Response
          this.filterTypes = types.filter(x => x.isActive == true)
        }
      )
  }

  calculateTotalWorker() {
    this.totalWorker = this.filterTypes.reduce((acc, worker) => acc + (worker.totalWorker || 0), 0)
  }

  add() {
    this.getNewArray();
    const localLabor = this.filterTypes.map(({ id, monthYear, createdBy, createdDate, totalWorker, estateId }) => ({ laborTypeId: id, monthYear, createdBy, createdDate, totalWorker, estateId })) as unknown as LocalLabor[]
    const filteredLabors = localLabor.filter(x => x !== null)
    console.log(localLabor)
    // if (filteredLabors.length === localLabor.length) {
    //   this.localLaborService.addLabor(localLabor)
    //     .subscribe(
    //       {
    //         next: (Response) => {
    //           swal.fire({
    //             title: 'Done!',
    //             text: 'Local Labor successfully submitted!',
    //             icon: 'success',
    //             showConfirmButton: false,
    //             timer: 1000
    //           });
    //           this.getLocalLabor()
    //           this.getLaborType()
    //           this.totalWorker = 0
    //         },
    //         error: (Error) => {
    //           swal.fire({
    //             text: 'Please fil up the form',
    //             icon: 'error'
    //           });
    //         }
    //       })
    // }
  }

  getLocalLabor() {
    this.localLaborService.getLabor()
      .subscribe(
        Response => {
          const localLabors = Response
          this.filterLocalLabors = localLabors.filter(x => x.monthYear == this.labor.monthYear && x.estateId == this.sharedService.estateId)
          this.TotalWorker()
        }
      )
  }

  TotalWorker() {
    this.totalLocalWorker = this.filterLocalLabors.reduce((acc, item) => acc + (item.totalWorker || 0), 0)
  }

  update(labor:LocalLabor) {
    const dialogRef = this.dialog.open(LaborLocalDetailComponent, {
      data: { data: labor },
    })

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.getLocalLabor()
        });
  }

  futureMonth(): boolean {
    if (!this.labor.monthYear) {
      return false;
    }
    const selectedDate = new Date(this.labor.monthYear);
    if (selectedDate.getFullYear() < this.currentDate.getFullYear() ||
      (selectedDate.getFullYear() === this.currentDate.getFullYear() &&
        selectedDate.getMonth() < this.currentDate.getMonth())) {
      return true
    } else {
      return false
    }
  }

  isUpdateDisabled(): boolean {
    if (!this.labor.monthYear) {
      return false
    }
    const selectedDate = new Date(this.labor.monthYear)
    const currentDate = new Date()
    if (
      //condition to check other month not same as current and previous
      !((selectedDate.getFullYear() === currentDate.getFullYear() && selectedDate.getMonth() === currentDate.getMonth()) ||
        (selectedDate.getFullYear() === currentDate.getFullYear() && selectedDate.getMonth() === currentDate.getMonth() - 1)) ||
      //to check if previous month more than 15th
      (currentDate.getDate() >= 15)
    ) {
      return true
    }
    return false
  }

  


  

}
