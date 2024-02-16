import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from 'src/app/_interface/role';
import { User } from 'src/app/_interface/user';
import { RoleService } from 'src/app/_services/role.service';
import { UserService } from 'src/app/_services/user.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-pending-role-detail',
  templateUrl: './pending-role-detail.component.html',
  styleUrls: ['./pending-role-detail.component.css']
})
export class PendingRoleDetailComponent implements OnInit {

  user:User = {} as User
  roles:Role [] = []

  constructor(
    public dialog:MatDialogRef<User>,
    @Inject(MAT_DIALOG_DATA) public data : {data :User},
    private roleService:RoleService,
    private userService:UserService
  ){}

  ngOnInit(): void {
    this.user = this.data.data
    this.getRole()
  }

  back() {
    this.dialog.close()
  }

  getRole(){
    this.roleService.getRole()
    .subscribe(
      Response =>{
        this.roles = Response
      }
    )

  }

  update(){
    this.userService.addUserRole(this.user)
    .subscribe(
      Response => {
      if(Response.roleName == null){
        this.userService.sendWelcomeEmail(JSON.stringify(this.user.email))
        .subscribe(
          Response =>{
            swal.fire({
              title: 'Done!',
              text: 'User successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
          }
        )
        this.dialog.close()
      }
      else{
        swal.fire({
          title: 'Done!',
          text: 'User successfully updated!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.dialog.close()
      }
  })
}
}
