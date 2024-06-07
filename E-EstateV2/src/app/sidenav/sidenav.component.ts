import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../_interface/user';
import { SharedService } from '../_services/shared.service';
import { UserService } from '../_services/user.service';
import { NotificationComponent } from '../notification/notification.component';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit , OnDestroy{
  user: User = {} as User
  estate: any = {} as any
  company: any = {} as any


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
    private sharedService: SharedService,
    private userService: UserService,
    public notificationComponent: NotificationComponent,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.getUser()
    if(this.role == 'EstateClerk')
      {
        this.getEstate()
      }
    else if(this.role == 'CompanyAdmin')
      {
        this.getCompany()
      }
  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.sharedService.estateId)
    .subscribe(
      Response => {
        this.estate = Response
        this.estate.add1 = this.estate.add1.slice(0, -1) 
      })
    this.subscriptionService.add(getOneEstate);
  }

  getCompany() {
    const getOneCompany = this.myLesenService.getOneCompany(this.sharedService.companyId)
      .subscribe(
        Response => {
          this.company = Response
        }
      )
    this.subscriptionService.add(getOneCompany);

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
    this.username = this.sharedService.userName
    if (this.role != 'Admin') {
      const getUser = this.userService.getUser(this.username)
        .subscribe(
          Response => {
            this.user = Response
            this.sharedService.userId = this.user.id
            this.companyId = this.user.companyId
            this.estateId = this.user.estateId
          }
        )
    this.subscriptionService.add(getUser);

    }
    
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
