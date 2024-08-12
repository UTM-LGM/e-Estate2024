import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/_interface/user';
import { UserService } from 'src/app/_services/user.service';
import { UserListUpdateComponent } from '../user-list-update/user-list-update.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  term = ''
  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1
  users: User[] = []
  itemsPerPage = 10

  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'fullName', displayText: 'User Fullname' },
    { columnName: 'licenseNo', displayText: 'License No' },
    { columnName: 'position', displayText: 'Position' },
    { columnName: 'username', displayText: 'Username' },
    { columnName: 'email', displayText: 'Email' },
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isLoading = true
    this.getUser()
  }

  getUser() {
    this.userService.getAllUser()
      .subscribe(
        Response => {
          this.users = Response
          this.isLoading = false
        }
      )
  }

  ngOnDestroy(): void {

  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  openDialog(user: User) {
    const dialogRef = this.dialog.open(UserListUpdateComponent, {
      data: { data: user }
    })
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        });
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
