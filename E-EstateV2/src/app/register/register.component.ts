import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRoleComponent } from './add-role/add-role.component';
import { Role } from '../_interface/role';
import { RoleService } from '../_services/role.service';
import { User } from '../_interface/user';
import { UserService } from '../_services/user.service';
import swal from 'sweetalert2';
import { EmailService } from '../_services/email.service';
import { Email } from '../_interface/email';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SpinnerService } from '../_services/spinner.service';
import { SubscriptionService } from '../_services/subscription.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

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
    private emailService: EmailService,
    private myLesenService: MyLesenIntegrationService,
    private spinnerService: SpinnerService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getRole()
  }

  getRole() {
    const getRole = this.roleService.getRole()
      .subscribe(
        Response => {
          this.roles = Response;
        }
      )
      this.subscriptionService.add(getRole);
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
      this.register.companyId = this.result.companyId
      this.register.estateId = this.result.premiseId
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
    this.spinnerService.requestStarted()
    setTimeout(() => {
      const getLicense = this.myLesenService.getLicenseNo(event.target.value.toString())
        .subscribe(
          {
            next: (Response) => {
              this.result = Response
              this.spinnerService.requestEnded();
              swal.fire({
                title: 'Done!',
                text: 'Data found!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
            },
            error: (Error) => {
              this.spinnerService.requestEnded();
              swal.fire({
                icon: 'error',
                title: 'Error! License No does not exist',
              });
              this.register.licenseNo = ''
              this.result = {}
            }
          })
      this.subscriptionService.add(getLicense);

    }, 1000)
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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
