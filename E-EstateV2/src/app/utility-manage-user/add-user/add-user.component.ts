import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Role } from 'src/app/_interface/role';
import { User } from 'src/app/_interface/user';
import { RoleService } from 'src/app/_services/role.service';
import { UserService } from 'src/app/_services/user.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  register = {} as User
  roles:Role [] = []

  showPassword: boolean = false
  username = ''

  constructor(
    public dialog: MatDialogRef<User>,
    private userService: UserService,
    private roleService:RoleService,
  ){}

  ngOnInit(): void {
    this.getRole()
  }

  getRole(){
    this.roleService.getRole()
    .subscribe(
      Response =>{
        const roles = Response
        this.roles = roles.filter(x=>x.name == "Admin")
      }
    )
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  addUser(){
    this.userService.addUser(this.register)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'User successfully registered!',
          icon: 'success',
          showConfirmButton: true,
        });
      this.dialog.close()
      }
    )
  }

  checkUsername(event: any) {
    this.userService.checkUsername(event.target.value.toString())
      .subscribe(
        {
          next: (Response: any) => {
            this.username = Response
          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: 'Error ! ' + Error.error + ' !',
            });
            this.register.userName = ''
          }
        }
      )
  }

  back(){
    this.dialog.close()
  }


}
