import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Email } from 'src/app/_interface/email';
import { LaborForeignerComponent } from '../labor-foreigner.component';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';
import { EmailService } from 'src/app/_services/email.service';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent {

  email = {} as Email

  constructor(
    private dialogRef: MatDialogRef<LaborForeignerComponent>,
    private emailService: EmailService,
    private sharedService: SharedService,
  ) { }

  sendEmail() {
    this.email.from = this.sharedService.email
    this.email.userName = this.sharedService.userName
    this.email.userId = this.sharedService.userId.toString();
    this.emailService.sendEmailCountry(this.email)
      .subscribe(
        {
          next: (Response: any) => {
            swal.fire({
              title: 'Done!',
              text: Response.message,
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'Done',
            });
            this.dialogRef.close();
          },
          error: (err) => {
            swal.fire({
              text: err.message,
              icon: 'error'
            });
          }
        }
      )
  }

  back() {
    this.dialogRef.close()
  }
}
