import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Email } from '../_interface/email';
import { Observable } from 'rxjs';
import { User } from '../_interface/user';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  sendEmailCountry(email: Email): Observable<Email> {
    return this.http.post<Email>(this.baseUrl + '/emails/SendEmailCountry', email)
  }

  sendEmailVerification(email: Email): Observable<Email> {
    return this.http.post<Email>(this.baseUrl + '/emails/SendEmailVerification', email)
  }

  sendResetPasswordEmail(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/emails/SendResetPasswordEmail', user)
  }

  submitNewPassword(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/emails/ResetPassword', user)
  }
}
