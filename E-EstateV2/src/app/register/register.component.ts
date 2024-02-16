import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRoleComponent } from './add-role/add-role.component';
import { Role } from '../_interface/role';
import { RoleService } from '../_services/role.service';
import { User } from '../_interface/user';
import { UserService } from '../_services/user.service';
import swal from 'sweetalert2';
import { EmailService } from '../_services/email.service';
import { Email } from '../_interface/email';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  roles: Role[] = []

  register = {} as User
  result = {} as any
  email = {} as Email
  username = ''
  showPassword: boolean = false

  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private userService: UserService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.getRole()
  }

  getRole() {
    this.roleService.getRole()
      .subscribe(
        Response => {
          this.roles = Response;
        }
      )
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        });
  }

  submitRegister() {
    if (this.register.userName == '') {
      swal.fire({
        icon: 'error',
        title: 'Error, Please fill up the form',
      })
    }
    else {
      this.register.isEmailVerified = false
      this.userService.register(this.register)
        .subscribe(
          {
            next: (Response) => {
              this.email.to = this.register.email
              this.email.userName = this.register.userName
              this.emailService.sendEmailVerification(this.email)
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
                      this.reset()
                    }
                  }
                )

            },
            error: (Error) => {
              swal.fire({
                icon: 'error',
                title: 'Error, Registration failed !',
              });
            }
          })
    }
  }

  reset() {
    this.register = {} as User
    this.result = {}
  }

  checkLicenseNo(event: any) {
    this.userService.checkLicenseNo(event.target.value.toString())
      .subscribe(
        {
          next: (Response) => {
            this.result = Response
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: 'Error ! ' + Error.error + ' !',
            });
            this.register.licenseNo = ''
            this.result = {}
          }
        })
  }

  checkUsername(event: any) {
    this.userService.checkUsername(event.target.value.toString())
      .subscribe(
        {
          next: (Response: any) => {
            this.username = Response
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: 'Error ! ' + Error.error + ' !',
            });
            this.register.userName = ''
          }
        }
      )
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

}
