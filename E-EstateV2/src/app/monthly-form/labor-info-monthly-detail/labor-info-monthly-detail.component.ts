import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LaborInfoMonthlyComponent } from '../labor-info-monthly/labor-info-monthly.component';
import { LaborInfo } from 'src/app/_interface/laborInfo';
import { LaborByCategory } from 'src/app/_interface/laborCategory';
import { SharedService } from 'src/app/_services/shared.service';
import { LaborInformation } from 'src/app/_interface/laborInformation';
import swal from 'sweetalert2';
import { LaborInfoService } from 'src/app/_services/labor-info.service';
import { SpinnerService } from 'src/app/_services/spinner.service';

@Component({
  selector: 'app-labor-info-monthly-detail',
  templateUrl: './labor-info-monthly-detail.component.html',
  styleUrls: ['./labor-info-monthly-detail.component.css']
})
export class LaborInfoMonthlyDetailComponent {

  labor: LaborInfo = {} as LaborInfo
  filterTypes: LaborInformation[] = []
  laborCategory: any = {} as LaborByCategory
  filterCategory: any = {} as any

  constructor(
    public dialogRef: MatDialogRef<LaborInfoMonthlyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: LaborInfo },
    private sharedService: SharedService,
    private laborInfoService: LaborInfoService,
    private spinnerService:SpinnerService
  ) { }

  ngOnInit() {
    this.labor = this.data.data
    this.laborCategory = this.data.data.laborCategory
  }

  update() {
    this.spinnerService.requestStarted()
    this.labor.updatedBy = this.sharedService.userId.toString()
    this.labor.updatedDate = new Date()
    this.laborInfoService.updateLaborInfo(this.labor)
      .subscribe(
        Response => {
          const filterLabor = this.laborCategory.map(({ laborType, ...obj }: any) => obj)
          this.laborInfoService.updateLaborCategory(filterLabor)
            .subscribe(
              Response => {
                this.spinnerService.requestEnded()
                swal.fire({
                  title: 'Done!',
                  text: 'Labor successfully updated!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
                this.dialogRef.close()
              }
            )
        }
      )

  }

  back() {
    this.dialogRef.close()
  }

}
