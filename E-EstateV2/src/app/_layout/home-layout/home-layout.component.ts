import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { User } from 'src/app/_interface/user';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { ToastrService } from 'ngx-toastr';
import { BadgeService } from 'src/app/_services/badge.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/change-password/change-password.component';
import { MsalService } from '@azure/msal-angular';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav

  user = {} as User
  userId = 0
  username = ''
  email = ''
  role = ''
  fullName = ''
  position = ''
  badgeCount = 0

  constructor(
    private observer: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private badgeServie: BadgeService,
    private dialog: MatDialog,
    private msalService: MsalService,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit() {
    this.username = this.sharedService.userName
    this.success(this.username)
    this.role = this.sharedService.role
    if (this.role != 'Admin') {
      const userSubscribe = this.userService.getUser(this.username)
        .subscribe(
          Response => {
            this.user = Response
            this.email = Response.email
            this.fullName = Response.fullName
            this.position = Response.position
          }
        )
        this.subscriptionService.add(userSubscribe);
    } else {
      this.email = this.sharedService.email
      this.fullName = this.sharedService.fullName
      this.position = this.sharedService.role
    }
    this.badgeServie.badgeCount$.subscribe((count) => {
      this.badgeCount = count
    });
  }


  success(user: string) {
    this.toastr.success('Welcome ' + user + ' !')
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 900px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over'
        this.sidenav.close()
      } else {
        this.sidenav.mode = 'side'
        this.sidenav.open()
      }
    });
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges()
  }

  logOut() {
    localStorage.removeItem('token')
    this.router.navigateByUrl('/login')
    this.toastr.success(this.username + ' Logout Successfully')
  }

  logOutStaff() {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'https://lgm20.lgm.gov.my/e-Estate'
    });
    localStorage.clear();
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
    });

    dialogRef.afterClosed()
      .subscribe(
        Response => {
        }
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
