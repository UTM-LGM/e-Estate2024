import { Component, OnInit } from '@angular/core';
import { User } from '../_interface/user';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeLayoutComponent } from '../_layout/home-layout/home-layout.component';
import { SharedService } from '../_services/shared.service';
import { UserService } from '../_services/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  register = {} as User
  showPassword: boolean = false
  userId = ''

  constructor(
    public dialog: MatDialogRef<HomeLayoutComponent>,
    private sharedService: SharedService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userId = this.sharedService.userId
  }

  submitNewPassword() {
    this.register.id = this.sharedService.userId, 
    console.log(this.register)
    this.userService.changePassword(this.register)
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
            this.dialog.close()
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: Error.error,
            });
          }
        }
      )
  }

  back() {
    this.dialog.close()
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  checkOldPassword() {
    this.userService.checkOldPassword(this.userId, this.register.oldPassword)
      .subscribe(
        {
          next: (Response) => {
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: 'Error ! ' + Error.error + ' !',
            });
            this.register.oldPassword = ''
          }
        }
      )
  }
}
