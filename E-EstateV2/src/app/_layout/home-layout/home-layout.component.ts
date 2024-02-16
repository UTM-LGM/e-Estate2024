import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit {
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
    private auth: AuthGuard,
    private toastr: ToastrService,
    private badgeServie: BadgeService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.username = this.auth.getUsername()
    this.success(this.username)
    this.role = this.auth.role
    this.userService.getUser(this.username)
      .subscribe(
        Response => {
          this.user = Response
          this.email = Response.email
          this.fullName = Response.fullName
          this.position = Response.position
        }
      )
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

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
    });

    dialogRef.afterClosed()
      .subscribe(
        Response => {
        }
      )
  }
}
