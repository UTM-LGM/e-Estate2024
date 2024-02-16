import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ForeignLabor } from 'src/app/_interface/foreignLabor';
import { LaborForeignerComponent } from '../labor-foreigner/labor-foreigner.component';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';
import { ForeignLaborService } from 'src/app/_services/foreign-labor.service';

@Component({
  selector: 'app-labor-foreigner-detail',
  templateUrl: './labor-foreigner-detail.component.html',
  styleUrls: ['./labor-foreigner-detail.component.css']
})
export class LaborForeignerDetailComponent implements OnInit {
  labor: ForeignLabor = {} as ForeignLabor

  constructor(
    public dialogRef: MatDialogRef<LaborForeignerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: ForeignLabor },
    private sharedService: SharedService,
    private foreignLaborService: ForeignLaborService,
  ) { }

  ngOnInit() {
    this.labor = this.data.data
  }

  update() {
    this.labor.updatedBy = this.sharedService.userId.toString()
    this.labor.updatedDate = new Date()
    this.foreignLaborService.updateLabor(this.labor)
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

  back() {
    this.dialogRef.close()
  }

}
