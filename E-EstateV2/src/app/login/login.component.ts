import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../_services/spinner.service';
import { User } from '../_interface/user';
import { UserService } from '../_services/user.service';
import swal from 'sweetalert2';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginUser: User = {} as User;
  user: User = {} as User;
  userId = ''
  showPassword = false

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private userService: UserService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
  ) { }

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.spinnerService.requestStarted();
    setTimeout(() => {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        const activeAccount = localStorage.getItem('activeAccount');
        if (activeAccount) {
          // Set the active account from local storage
          this.msalService.instance.setActiveAccount(JSON.parse(activeAccount));
        } else {
          // Set the first account as the active account if none is set
          this.msalService.instance.setActiveAccount(accounts[0]);
          localStorage.setItem('activeAccount', JSON.stringify(accounts[0]));
        }
        this.spinnerService.requestEnded();
        this.router.navigateByUrl('/home');
      } else {
        this.spinnerService.requestEnded();
        this.router.navigateByUrl('/login');
      }
    }, 2000);
  }


  login() {
    this.spinnerService.requestStarted()
    setTimeout(() => {
      this.userService.login(this.loginUser)
        .subscribe(
          {
            next: (Response: any) => {
              localStorage.setItem('token', Response.token)
              this.spinnerService.requestEnded()
              this.router.navigateByUrl('/home')
            },
            error: (Error) => {
              swal.fire({
                icon: 'error',
                title: 'Error',
                text: Error.error.message,
              })
              this.spinnerService.requestEnded()
            }
          })
    })
  }

  async loginStaff() {
    //handle error: Interaction is currently in progress. Please ensure that this interaction has been completed before calling an interactive API.
    if (this.msalGuardConfig.authRequest) {
      await this.msalService.instance.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  register() {
    this.router.navigateByUrl('/register')
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }
}
