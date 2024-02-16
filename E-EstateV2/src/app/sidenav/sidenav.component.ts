import { Component, OnInit } from '@angular/core';
import { User } from '../_interface/user';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';
import { SharedService } from '../_services/shared.service';
import { UserService } from '../_services/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  user: User = {} as User
  role = ''
  username = ''
  companyId = 0
  estateId = 0
  showMonthly = false
  showYearly = false
  showReport = false
  showGeneral = false
  showUtility = false
  showOthers = false

  constructor(
    private auth: AuthGuard,
    private sharedService: SharedService,
    private userService: UserService,
    public notificationComponent: NotificationComponent
  ) { }

  ngOnInit() {
    this.role = this.auth.getRole()
    this.getUser()
  }


  toggleMonthly() {
    this.showMonthly = !this.showMonthly
  }

  toggleYearly() {
    this.showYearly = !this.showYearly
  }

  toggleReport() {
    this.showReport = !this.showReport
  }

  toggleGeneral() {
    this.showGeneral = !this.showGeneral
  }

  toggleUtility() {
    this.showUtility = !this.showUtility
  }

  toggleOthers() {
    this.showOthers = !this.showOthers
  }

  getUser() {
    this.username = this.auth.getUsername()
    this.userService.getUser(this.username)
      .subscribe(
        Response => {
          this.user = Response
          this.sharedService.userId = this.user.id
          this.companyId = this.user.companyId
          this.estateId = this.user.estateId
        }
      )
  }

}
