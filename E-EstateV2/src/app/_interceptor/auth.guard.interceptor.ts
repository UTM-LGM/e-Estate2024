import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UserService } from '../_services/user.service';
import { User } from '../_interface/user';
import { SharedService } from '../_services/shared.service';
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { EstateDetailService } from '../_services/estate-detail.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  user = {} as User

  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private estateService:EstateDetailService,
    private msalService: MsalService
  ) {
    const activeAccount = localStorage.getItem('activeAccount');
    if (activeAccount) {
      this.msalService.instance.setActiveAccount(JSON.parse(activeAccount));
    }
  }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const accounts = this.msalService.instance.getAllAccounts();
    const token = localStorage.getItem('token')
    if (accounts.length == 0 && token != null) {
      //deserialize Token JWT
      const decodedToken: any = jwt_decode(token);
      this.sharedService.role = decodedToken.role
      this.sharedService.userName = decodedToken.userName
      this.sharedService.estateId = decodedToken.estateId
      this.sharedService.companyId = decodedToken.companyId
      this.getUser(decodedToken.estateId, decodedToken.companyId)

      //check jwt expired time
      const currentTime = new Date().getTime()

      //*1000 to convert milisecond
      if (decodedToken.exp * 1000 < currentTime) {
        this.router.navigateByUrl('/login')
        return of(false)
      }
    }
    else if (accounts.length > 0) {
      this.setAccessToken()
      // let roles = next.data['permittedRoles'] as Array<string>
      // if (roles) {
      //   return of(this.roleMatch(roles) ? true : false);
      // }
      // else {
      // }
    }
    else {
      this.router.navigateByUrl('/login')
      return of(false)
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

  async setAccessToken() {
    await this.msalService.instance.initialize();

    // Entra Id-Production
    const clientId = '4c278748-3ef9-49f9-94ec-9591a665a4b7'; // Your client ID

    //STaging
    // const clientId = '91409c1e-06ba-4c11-89b6-6002d296a769'
    
    const tokenInfoString = localStorage.getItem(`msal.token.keys.${clientId}`)

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
    else {
      localStorage.clear()
      window.location.reload()
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
    const token = localStorage.getItem('accessToken');

    if (token !== null) {
      const decodedToken: any = jwt_decode(token);
      this.sharedService.roles = decodedToken.roles;
      this.sharedService.role = decodedToken.roles[0];

      const currentTime = new Date().getTime();

      if (decodedToken.exp * 1000 < currentTime) {
        const activeAccount = this.msalService.instance.getActiveAccount();

        if (activeAccount) {
          console.log('Token expired, attempting silent token acquisition...');

          if (InteractionRequiredAuthError) {
            console.log('Interaction required, redirecting to login...');
            this.msalService.loginRedirect({
              scopes: ["api://e-EstateAPI/.default"],
              redirectUri: 'https://www5.lgm.gov.my/RRIMestet/home'
              // redirectUri: 'https://www5.lgm.gov.my/trainingE-estate'
            });
            localStorage.clear();
            this.router.navigateByUrl('/login');
            return of(false);
          } else {
            return this.msalService.acquireTokenSilent({
              scopes: ["api://e-EstateAPI/.default"],
              account: activeAccount
            })
          }
        } else {
          console.log('No active account', activeAccount)
          return of(false)
        }

        // if (activeAccount) {
        //   console.log('Token expired, attempting silent token acquisition...');

        //   return this.msalService.acquireTokenSilent({
        //     scopes: ["api://e-EstateAPI/.default"],
        //     account: activeAccount
        //   }).pipe(
        //     switchMap((response) => {
        //       console.log('Silent token acquisition successful.');
        //       localStorage.setItem('accessToken', response.accessToken);
        //       return of(true);
        //     }),
        //     catchError((error) => {
        //       console.error('Token acquisition error:', error);

        //       if (error instanceof InteractionRequiredAuthError) {
        //         console.log('Interaction required, redirecting to login...');
        //         this.msalService.loginRedirect({
        //           scopes: ["api://e-EstateAPI/.default"],
        //           redirectUri: 'https://www5.lgm.gov.my/e-Estate'
        //         });
        //         localStorage.clear();
        //         this.router.navigateByUrl('/login');
        //         return of(false);
        //       } else {
        //         console.log('Silent token acquisition failed, logging out...');
        //         this.msalService.logoutRedirect({
        //           postLogoutRedirectUri: 'https://www5.lgm.gov.my/e-Estate'
        //         });
        //         localStorage.clear();
        //         this.router.navigateByUrl('/login');
        //         return of(false);
        //       }
        //     })
        //   );
        // } else {
        //   console.log('No active account found, logging out...');
        //   this.msalService.logoutRedirect({
        //     postLogoutRedirectUri: 'https://www5.lgm.gov.my/e-Estate'
        //   });
        //   localStorage.clear();
        //   this.router.navigateByUrl('/login');
        //   return of(false);
        // }
      } else {
        console.log('Token is still valid.');
        return of(true);
      }
    } else {
      console.log('No token found, redirecting to login...');
      this.msalService.loginRedirect({
        scopes: ["api://e-EstateAPI/.default"],
        redirectUri: 'https://www5.lgm.gov.my/RRIMestet'
        // redirectUri: 'https://www5.lgm.gov.my/trainingE-estate'
      });
      localStorage.clear();
      this.router.navigateByUrl('/login');
      return of(false);
    }
  }

  decodeIdToken() {
    const token = localStorage.getItem('idToken')
    if (token != null) {
      const decodedToken: any = jwt_decode(token)
      if (decodedToken != null) {
        this.sharedService.email = decodedToken.email
        this.sharedService.fullName = decodedToken.name
        this.sharedService.userId = decodedToken.oid
        this.sharedService.userName = decodedToken.preferred_username
      }
      else {
      }
    }
  }

  setActiveAccount() {
    var acc = localStorage.getItem('activeAccount')
    if (acc != null) {
      const activeAccount = JSON.parse(acc);
      if (activeAccount) {
        this.msalService.instance.setActiveAccount(activeAccount);
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
          this.sharedService.position = this.user.position
          this.sharedService.fullName = this.user.fullName
          if (this.sharedService.role != "Admin" && this.sharedService.role != "Management") {
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