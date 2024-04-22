import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UserService } from '../_services/user.service';
import { User } from '../_interface/user';
import { SharedService } from '../_services/shared.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  role = ''
  username = ''
  estateId = 0
  companyId = ''

  user = {} as User

  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {
  }
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const token = localStorage.getItem('token')
    if (token != null) {
      //deserialize Token JWT
      const decodedToken: any = jwt_decode(token);
      this.role = decodedToken.role
      this.username = decodedToken.userName
      this.estateId = decodedToken.estateId
      this.companyId = decodedToken.companyId

      //check jwt expired time
      const currentTime = new Date().getTime()
      //*1000 to convert milisecond
      if (decodedToken.exp * 1000 < currentTime) {
        this.router.navigateByUrl('/login')
        return of(false)
      }
      else {
        this.getUser(this.estateId, this.companyId)
      }

      //checking roles
      let roles = next.data['permittedRoles'] as Array<string>
      if (roles) {
        return of(this.userService.roleMatch(roles) ? true : false);
      } else {
        return of(true);
      }
    }
    else {
      this.router.navigateByUrl('/login');
      return of(false)
    }
  }

  public getRole() {
    return this.role
  }

  public getUsername() {
    return this.username
  }

  public getEstateId() {
    return this.estateId
  }

  public getCompanyId() {
    return this.companyId
  }

  getUser(estateId: number, companyId: string) {
    this.userService.getUser(this.username)
      .subscribe(
        Response => {
          this.user = Response
          this.sharedService.userId = this.user.id
          this.sharedService.email = this.user.email
          if( this.getRole() != "Admin")
          {
            if (this.user.estateId == estateId && this.user.companyId.toString() == companyId) {
              this.sharedService.companyId = this.user.companyId
              this.sharedService.estateId = this.user.estateId
            }
            else {
              this.router.navigateByUrl('/login')
            }
          }
          else{
            
          }
          
        }
      )
  }

}