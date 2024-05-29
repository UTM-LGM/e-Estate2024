import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UserService } from '../_services/user.service';
import { User } from '../_interface/user';
import { SharedService } from '../_services/shared.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  user = {} as User

  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private msalService: MsalService
  ) {
  }
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const accounts = this.msalService.instance.getAllAccounts();
    const token = localStorage.getItem('token')
    if (accounts.length == 0 && token != null) {
      if (token != null) {

        //deserialize Token JWT
        const decodedToken: any = jwt_decode(token);
        this.sharedService.role = decodedToken.role
        this.sharedService.userName = decodedToken.userName
        this.sharedService.estateId = decodedToken.estateId
        this.sharedService.companyId = decodedToken.companyId

        //check jwt expired time
        const currentTime = new Date().getTime()

        //*1000 to convert milisecond
        if (decodedToken.exp * 1000 < currentTime) {
          this.router.navigateByUrl('/login')
          return of(false)
        }
        else {
          // this.getUser()
        }
      }
    }
    else if (accounts.length > 0) {
      this.setAccessToken()
      let roles = next.data['permittedRoles'] as Array<string>
      if (roles) {
        return of(this.roleMatch(roles) ? true : false);
      }
      else {
      }
    }
    else {
      this.router.navigateByUrl('/login')
    }
    return of(true)
  }

  roleMatch(allowedRole: any[]): boolean {
    const role = this.sharedService.roles
    const matchRole = allowedRole.map(x => x == role)
    if (matchRole.includes(true)) {
      return true
    }
    else {
      return false
    }
  }

  setAccessToken() {
    // Entra Id
    const clientId = '4c278748-3ef9-49f9-94ec-9591a665a4b7'; // Your client ID
    const tokenInfoString = localStorage.getItem(`msal.token.keys.${clientId}`);

    if (tokenInfoString !== null) {
      const tokenInfo = JSON.parse(tokenInfoString);
      if (tokenInfo.accessToken) {
        this.setIdToken(tokenInfo)
        const accessToken = tokenInfo.accessToken[0];
        const secret = localStorage.getItem(accessToken);
        if (secret !== null) {
          const secretInfo = JSON.parse(secret);
          localStorage.setItem('accessToken', secretInfo.secret);
          this.decodeAccessToken();
        }
      }
    }
  }

  setIdToken(tokenInfo: any) {
    if (tokenInfo.idToken) {
      const idToken = tokenInfo.idToken[0];
      const secret = localStorage.getItem(idToken);
      if (secret !== null) {
        const secretInfo = JSON.parse(secret);
        localStorage.setItem('idToken', secretInfo.secret);
        this.decodeIdToken()
      }
    }
  }

  decodeAccessToken() {
    const token = localStorage.getItem('accessToken')
    if (token != null) {
      const decodedToken: any = jwt_decode(token);

      this.sharedService.roles = decodedToken.roles;
      this.sharedService.role = decodedToken.roles[0];

      //check jwt expired time
      const currentTime = new Date().getTime()
      //*1000 to convert milisecond
      if (decodedToken.exp * 1000 < currentTime) {
        this.msalService.logoutRedirect({
          postLogoutRedirectUri: 'http://localhost:4200/login'
        });
        localStorage.clear()
        this.router.navigateByUrl('/login')
        return of(false)
      }
      else {
        return of(true)
      }
    }
    return of(true)
  }

  decodeIdToken() {
    const token = localStorage.getItem('idToken')
    if (token != null) {
      const decodedToken: any = jwt_decode(token)
      if (decodedToken != null) {
        // this.sharedService.roles = decodedToken.roles;
        // this.sharedService.role = decodedToken.roles[0];
        this.sharedService.email = decodedToken.email
        this.sharedService.fullName = decodedToken.name
        this.sharedService.userId = decodedToken.oid
        this.sharedService.userName = decodedToken.preferred_username
      }
      else {
      }
    }
  }

  getUser(estateId: number, companyId: number) {
    this.userService.getUser(this.sharedService.userName)
      .subscribe(
        Response => {
          this.user = Response
          this.sharedService.userId = this.user.id
          this.sharedService.email = this.user.email
          if (this.sharedService.role != "Admin") {
            if (this.user.estateId == estateId && this.user.companyId == companyId) {
              this.sharedService.companyId = this.user.companyId
              this.sharedService.estateId = this.user.estateId
            }
            else {
              this.router.navigateByUrl('/login')
            }
          }
          else {

          }

        }
      )
  }

}