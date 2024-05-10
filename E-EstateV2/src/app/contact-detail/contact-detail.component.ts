import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyContactService } from '../_services/company-contact.service';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { CompanyContact } from '../_interface/company-contact';
import { EstateContact } from '../_interface/estate-contact';
import { EstateContactService } from '../_services/estate-contact.service';


@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  contacts: CompanyContact[] = []

  companyContact = {} as CompanyContact
  estateContact = {} as EstateContact

  companyId = 0
  estateId = 0

  constructor(
    public dialog: MatDialogRef<CompanyContact>,
    private companyContactService: CompanyContactService,
    private estateContactService: EstateContactService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.companyContact = data.contact;
    this.estateContact = data.contact
    this.companyId = data.companyId;
    this.estateId = data.estateId;
  }

  ngOnInit() {
    if (this.companyContact.id == null) {
      this.companyContact.name = ''
    }
    if (this.companyId !== undefined) {
      this.estateId = 0
    } else if (this.estateId !== undefined) {
      this.companyId = 0
    }
  }



  addCompanyContact() {
    if (this.companyContact.name == '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else {
      this.companyContact.createdBy = this.sharedService.userId
      this.companyContact.companyId = this.companyId
      this.companyContact.isActive = true
      const { company, ...newContact } = this.companyContact
      const filteredContact = newContact
      this.companyContactService.addCompanyContact(filteredContact)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Contact successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close()
          }
        )
    }
  }

  addEstateContact() {
    if (this.estateContact.name == '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else {
      this.estateContact.createdBy = this.sharedService.userId
      this.estateContact.estateId = this.estateId
      this.estateContact.isActive = true
      const { estate, ...newContact } = this.estateContact
      const filteredContact = newContact
      this.estateContactService.addEstateContact(filteredContact)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Contact successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close()
          }
        )
    }
  }

  back() {
    this.dialog.close()
  }

  updateCompanyContact() {
    this.companyContact.updatedBy = this.sharedService.userId.toString()
    this.companyContact.updatedDate = new Date()
    this.companyContactService.updateCompanyContact(this.companyContact)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Contact successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialog.close()
        }
      )
  }

  updateEstateContact() {
    this.estateContact.updatedBy = this.sharedService.userId.toString()
    this.estateContact.updatedDate = new Date()
    this.estateContactService.updateEstateContact(this.estateContact)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Contact successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialog.close()
        }
      )
  }
}
