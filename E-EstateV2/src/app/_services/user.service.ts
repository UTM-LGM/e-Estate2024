import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { User } from '../_interface/user';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl

  role = ''

  constructor(
    private http: HttpClient
  ) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/applicationusers/Register', user)
  }

  addUser(user:User):Observable<User>{
    return this.http.post<User>(this.baseUrl + '/applicationusers/AddUser', user)
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/applicationusers/Login', user)
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/applicationusers/GetUser/' + username)
  }

  getAllUser():Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl + '/applicationusers/GetAllUser')
  }

  checkLicenseNo(licenseNo: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/applicationusers/CheckLicenseNo/' + licenseNo)
  }

  checkOldPassword(userId: string, oldPassword: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/applicationusers/CheckOldPassword/' + userId + '/' + oldPassword)
  }

  checkUsername(username: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/applicationusers/CheckUsername/' + username)
  }

  changePassword(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/applicationusers/ChangePassword', user)
  }

  roleMatch(allowedRole: any[]): boolean {
    let isMatch = false
    const token = localStorage.getItem('token')
    if (token != null) {
      const decodedToken: any = jwt_decode(token)
      this.role = decodedToken.role
    }
    allowedRole.forEach(x => {
      if (this.role == x) {
        isMatch = true
        return false
      }
      else {
        return isMatch
      }
    })
    return isMatch
  }

  addUserRole(user:User):Observable<User>{
    return this.http.post<User>(this.baseUrl + '/applicationusers/AddUserRole', user)
  }

  sendWelcomeEmail(email:string):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(this.baseUrl + '/applicationusers/SendWelcomeEmail', email, httpOptions)
  }
}
