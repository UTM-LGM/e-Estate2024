import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../_services/spinner.service';
import { User } from '../_interface/user';
import { UserService } from '../_services/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginUser: User = {} as User;
  user: User = {} as User;
  userId = ''
  showPassword = false

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private userService: UserService
  ) { }

  login() {
    this.spinnerService.requestStarted()
    setTimeout(() => {
      this.userService.login(this.loginUser)
        .subscribe(
          {
            next: (Response: any) => {
              localStorage.setItem('token', Response.token)
              this.spinnerService.requestEnded()
              this.router.navigateByUrl('/e-estate')
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

  register() {
    this.router.navigateByUrl('/register')
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

}
