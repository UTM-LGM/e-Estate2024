import { Component, OnInit } from '@angular/core';
import { User } from '../_interface/user';
import { EmailService } from '../_services/email.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import * as base64 from 'base64-js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  register = {} as User
  userId = ''
  isForgotPassword = false
  showPassword = false

  constructor(
    private emailService: EmailService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routerParams) => {
      const encodedUserId = routerParams['userId']
      this.register.token = routerParams['token']
      if (encodedUserId) {
        this.userId = this.decodeBase64(encodedUserId)

        if (this.userId && this.userId.length > 0) {
          this.isForgotPassword = true
        }
      }
    });
  }

  submitNewPassword() {
    this.register.id = this.userId
    this.emailService.submitNewPassword(this.register)
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
            this.router.navigateByUrl('/login')
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: Error.error.message,
            });
          }
        }
      )
  }

  decodeBase64(encoded: string): string {
    const bytes = base64.toByteArray(encoded)
    return new TextDecoder('utf-8').decode(bytes)
  }

  submitForgotPassword() {
    this.register.token = ''
    this.emailService.sendResetPasswordEmail(this.register)
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
            this.reset();
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

  reset() {
    this.register = {} as User
  }

  back() {
    this.location.back()
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }
}
