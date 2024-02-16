import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/_interface/user';
import { UserService } from 'src/app/_services/user.service';
import { PendingRoleDetailComponent } from '../pending-role-detail/pending-role-detail.component';

@Component({
  selector: 'app-pending-role',
  templateUrl: './pending-role.component.html',
  styleUrls: ['./pending-role.component.css']
})
export class PendingRoleComponent implements OnInit {

  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  isLoading = true
  users:User []=[]

  sortableColumns = [
    { columnName: 'fullName', displayText: 'User Fullname' },
    { columnName: 'email', displayText: 'Email' },
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'companyName', displayText: 'Company Name' },
    { columnName: 'companyPhoneNo', displayText: 'Company Phone No'},
    { columnName: 'position', displayText: 'Position' },
    { columnName: 'roleName', displayText: 'Role Name' },
  ];

  constructor(private userService:UserService,
    private dialog: MatDialog,
    )
  {}

   ngOnInit() {
     this.getUsers()
   }

   getUsers(){
    setTimeout(() => {
    this.userService.getAllUser()
    .subscribe(
      Response=>{
        const users = Response
        this.users = users.filter(x=>x.roleId == null && x.isEmailVerified == true)
        this.isLoading = false
      })
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


}
