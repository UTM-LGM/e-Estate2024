import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Buyer } from 'src/app/_interface/buyer';
import { RegisterBuyerComponent } from '../register-buyer/register-buyer.component';
import { BuyerService } from 'src/app/_services/buyer.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-edit-buyer',
  templateUrl: './edit-buyer.component.html',
  styleUrls: ['./edit-buyer.component.css']
})
export class EditBuyerComponent implements OnInit {

  buyer:Buyer = {} as Buyer

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : {data:Buyer},
    private dialogRef:MatDialogRef<RegisterBuyerComponent>,
    private buyerService:BuyerService,
    private spinnerService:SpinnerService
  ){}

  ngOnInit():void{
    this.buyer = this.data.data
  }

  back() {
    this.dialogRef.close()
  }

  update(){
    this.spinnerService.requestStarted()
    this.buyerService.updateBuyer(this.buyer)
    .subscribe(
      Response => {
        this.spinnerService.requestEnded()
        swal.fire({
          title: 'Done!',
          text: 'Buyer succesfully updated!',
          icon: 'success',
          showConfirmButton: true
        });
        this.dialogRef.close()
      }
    )
  }
}
