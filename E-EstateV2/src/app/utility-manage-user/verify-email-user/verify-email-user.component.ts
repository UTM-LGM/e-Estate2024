import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/_interface/user';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { UserService } from 'src/app/_services/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-verify-email-user',
  templateUrl: './verify-email-user.component.html',
  styleUrls: ['./verify-email-user.component.css']
})
export class VerifyEmailUserComponent {
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
    private spinnerService: SpinnerService,

  ) { }

  ngOnInit(): void {
    this.isLoading = true
    this.getUser()
  }

  getUser() {
    this.userService.getAllUser()
      .subscribe(
        Response => {
          this.users = Response.filter(x=>x.isEmailVerified == false && x.isActive == null)
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

  verifyEmail(user:User){
    user.isActive = true
    user.isEmailVerified = true
    this.userService.updateUser(user)
    .subscribe(
      Response => {
        this.spinnerService.requestEnded()
        swal.fire({
          title: 'Done!',
          text: 'User email verified!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.getUser()
      }
    )
  }

}
