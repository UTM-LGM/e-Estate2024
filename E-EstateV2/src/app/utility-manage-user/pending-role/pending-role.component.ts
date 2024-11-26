import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/_interface/user';
import { UserService } from 'src/app/_services/user.service';
import { PendingRoleDetailComponent } from '../pending-role-detail/pending-role-detail.component';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-pending-role',
  templateUrl: './pending-role.component.html',
  styleUrls: ['./pending-role.component.css']
})
export class PendingRoleComponent implements OnInit, OnDestroy {

  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  itemsPerPage = 10
  isLoading = true
  users:User []=[]
  result:any = {} as any

  sortableColumns = [
    { columnName: 'no', displayText: 'No'},
    { columnName: 'fullName', displayText: 'User Fullname' },
    { columnName: 'email', displayText: 'Email' },
    { columnName: 'licenseNo', displayText: 'License No' },
    { columnName: 'companyName', displayText: 'Company Name' },
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'companyPhoneNo', displayText: 'Company Phone No'},
    { columnName: 'position', displayText: 'Position' },
    { columnName: 'roleName', displayText: 'Role Name' },
  ];

  constructor(private userService:UserService,
    private dialog: MatDialog,
    private myLesenService:MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
    )
  {}

   ngOnInit() {
     this.getUsers()
   }

   getUsers(){
    setTimeout(() => {
    const getAllUser = this.userService.getAllUser()
    .subscribe(
      Response=>{
        const users = Response
        this.users = users.filter((x:any)=>x.roleId == null && x.isEmailVerified == true && x.isActive == true)
        this.users.forEach((user: any) => {
          const getLicenseNo = this.myLesenService.getLicenseNo(user.licenseNo)
          .subscribe(
            {
              next: (Response) => {
                this.result[user.licenseNo] = Response;
                this.isLoading = false
                this.subscriptionService.add(getLicenseNo);
              },
              error: (error: any) => {
                console.error("Error fetching license number:", error);
              }
            })})  
        this.isLoading = false
      })
      this.subscriptionService.add(getAllUser);

    }, 1000)
   }


  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  openDialog(user:User){
    const dialogRef = this.dialog.open(PendingRoleDetailComponent, {
      data : {data:user},
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        });
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  calculateIndex(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }

  onPageChange(newPageNumber: number) {
    if (newPageNumber < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = newPageNumber;
    }
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }


}
