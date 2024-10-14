import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'src/app/_interface/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/_services/user.service';
import swal from 'sweetalert2';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';


@Component({
  selector: 'app-user-list-update',
  templateUrl: './user-list-update.component.html',
  styleUrls: ['./user-list-update.component.css']
})
export class UserListUpdateComponent implements OnInit, OnDestroy {

  user: User = {} as User
  result = {} as any

  constructor(
    private location: Location,
    private dialog: MatDialogRef<User>,
    @Inject(MAT_DIALOG_DATA) public data: { data: User },
    private userService: UserService,
    private myLesenService: MyLesenIntegrationService,
    private spinnerService: SpinnerService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.user = this.data.data
    this.getLicenseDetail()
  }

  back() {
    this.dialog.close()
  }

  getLicenseDetail() {
    this.myLesenService.getLicenseNo(this.user.licenseNo)
      .subscribe(
        Response => {
          this.result = Response
        }
      )
  }

  checkLicenseNo(event: any) {
    this.spinnerService.requestStarted()
    setTimeout(() => {
      const getLicense = this.myLesenService.getLicenseNo(event.target.value.toString())
        .subscribe(
          {
            next: (Response) => {
              if (Response) {
                this.result = Response
                this.spinnerService.requestEnded();
                swal.fire({
                  title: 'Done!',
                  text: 'Data found!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
              } else {
                this.spinnerService.requestEnded();
                swal.fire({
                  icon: 'error',
                  title: 'Error! License No does not exist',
                });
                this.user.licenseNo = ''
                this.result = {}
              }

            },
            error: (Error) => {
              this.spinnerService.requestEnded();
              swal.fire({
                icon: 'error',
                title: 'Error! License No does not exist',
              });
              this.user.licenseNo = ''
              this.result = {}
            }
          })
      this.subscriptionService.add(getLicense);

    }, 1000)
  }

  update() {
    if (this.user.licenseNo == '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else {
      this.spinnerService.requestStarted()
      this.user.companyId = this.result.companyId
      this.user.estateId = this.result.premiseId
      this.userService.updateUser(this.user)
        .subscribe(
          Response => {
            this.spinnerService.requestEnded()
            swal.fire({
              title: 'Done!',
              text: 'User successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close()
          }
        )
    }

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
