import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/_services/role.service';
import swal from 'sweetalert2';
import { RegisterComponent } from '../register.component';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  roleName = ''

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {

  }

  submit() {
    this.roleService.addRole(this.roleName)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Role successfully added!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )
  }
}
