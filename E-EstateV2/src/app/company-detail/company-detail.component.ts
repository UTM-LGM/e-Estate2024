import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../_interface/company';
import swal from 'sweetalert2';
import { UserActivityLog } from '../_interface/userActivityLog';
import { Location } from '@angular/common';
import { Estate } from '../_interface/estate';
import { SharedService } from '../_services/shared.service';
import { Field } from '../_interface/field';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';
import { CompanyService } from '../_services/company.service';
import { EstateService } from '../_services/estate.service';
import { FieldService } from '../_services/field.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCompanyDetailComponent } from '../edit-company-detail/edit-company-detail.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { CompanyContact } from '../_interface/company-contact';
import { CompanyContactService } from '../_services/company-contact.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit {
  company: Company = {} as Company

  activityLog: UserActivityLog = {} as UserActivityLog

  contacts:any = {} as any

  estate: any = {} as any

  isLoading = true

  term = ''
  userRole = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  selectedEstate: any

  sortableColumns = [
    { columnName: 'estateName', displayText: 'Estate Name' },
    { columnName: 'state', displayText: 'State' },
    { columnName: 'town1', displayText: 'Town' },
    { columnName: 'email', displayText: 'Email' },
    { columnName: 'licenseNo', displayText: 'License No' },
    { columnName: 'totalArea', displayText: 'Total Area (Ha)' },
    { columnName: 'membershipType', displayText: 'Membership Type' },
  ];

  sortableColumnContacts = [
    { columnName: 'name', displayText: 'Name' },
    { columnName: 'position', displayText: 'Position' },
    { columnName: 'phoneNo', displayText: 'Phone No' },
    { columnName: 'email', displayText: 'Email' },
  ];

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private estateService: EstateService,
    private location: Location,
    private fieldService: FieldService,
    private sharedService: SharedService,
    private auth: AuthGuard,
    private dialog: MatDialog,
    private companyContactService:CompanyContactService
  ) { }

  ngOnInit() {
    this.userRole = this.auth.getRole()
    this.getCompany()
    this.getContact()
  }

  getCompany() {
    setTimeout(() => {
      this.route.params.subscribe((routeParams) => {
        if (routeParams['id'] != null) {
          this.companyService.getOneCompany(routeParams['id'])
            .subscribe(
              Response => {
                this.company = Response
                this.isLoading = false
              });
        }
      });
    }, 2000)
  }

  getContact(){
    this.companyContactService.getCompanyContact()
    .subscribe(
      Response =>{
        this.contacts = Response
      }
    )
  }

  statusCompany(company: Company) {
    company.updatedBy = this.sharedService.userId.toString()
    company.updatedDate = new Date()
    company.isActive = !company.isActive
    this.companyService.updateCompany(company)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Company Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.getCompany()
        }
      );
  }

  statusContact(contact: CompanyContact) {
    contact.updatedBy = this.sharedService.userId.toString()
    contact.updatedDate = new Date()
    contact.isActive = !contact.isActive
    this.companyContactService.updateCompanyContact(contact)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'Contact Status successfully updated!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.ngOnInit()
      }
    )
  }

  back() {
    this.location.back()
  }

  statusEstate(estate: Estate) {
    estate.updatedBy = this.sharedService.userId.toString()
    estate.updatedDate = new Date()
    estate.isActive = !estate.isActive
    this.estateService.updateEstate(estate)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Estate Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit();
        }
      )
  }

  statusField(field: Field) {
    field.updatedBy = this.sharedService.userId.toString()
    field.updatedDate = new Date()
    field.isActive = !field.isActive
    this.fieldService.updateField(field)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Field Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      )
  }

  toggleSelectedEstate(estate: Estate) {
    if (this.selectedEstate === estate) {
      this.selectedEstate = null
    } else {
      this.selectedEstate = estate
    }
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  openDialog(company: Company) {
    const dialogRef = this.dialog.open(EditCompanyDetailComponent, {
      data: { data: company },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

  openDialogCompanyContact(contact:CompanyContact, company:Company)
  {
    const dialogRef = this.dialog.open(ContactDetailComponent, {
      data:{contact: contact, companyId: company.id},
    })
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

}
