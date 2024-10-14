import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalLabor } from 'src/app/_interface/localLabor';
import { LaborLocalComponent } from '../labor-local/labor-local.component';
import { SharedService } from 'src/app/_services/shared.service';
import { LocalLaborService } from 'src/app/_services/local-labor.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-labor-local-detail',
  templateUrl: './labor-local-detail.component.html',
  styleUrls: ['./labor-local-detail.component.css']
})
export class LaborLocalDetailComponent implements OnInit {
  labor: LocalLabor = {} as LocalLabor
  filteredLabor: any = {}

  constructor(
    public dialogRef: MatDialogRef<LaborLocalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: LocalLabor },
    private sharedService: SharedService,
    private localLaborService: LocalLaborService
  ) { }

  ngOnInit() {
    this.labor = this.data.data
  }

  back() {
    this.dialogRef.close()
  }

  update() {
    this.labor.updatedBy = this.sharedService.userId.toString()
    this.labor.updatedDate = new Date()
    const { laborType, ...newLabor } = this.labor
    this.filteredLabor = newLabor
    this.localLaborService.updateLabor(this.filteredLabor)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Labor successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        })
  }
}
