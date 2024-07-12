import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { CompanyDetail } from '../_interface/company-detail';
import { SubscriptionService } from '../_services/subscription.service';
import { MembershipService } from '../_services/membership.service';
import { CompanyDetailService } from '../_services/company-detail.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit, OnDestroy {
  company: any = {} as any

  activityLog: UserActivityLog = {} as UserActivityLog

  contacts: any[] = []

  estate: any = {} as any

  isLoading = true

  companyDetail: CompanyDetail = {} as CompanyDetail

  termContact = ''
  termEstate = ''

  userRole = ''
  order = ''
  currentSortedColumn = ''

  itemsPerPageContact = 5
  itemsPerPageEstate = 10

  membership = {} as any

  selectedEstate: any

  companyId = 0
  contactsPageNumber = 1
  estatesPageNumber=1

  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'name', displayText: 'Estate Name' },
    { columnName: 'state', displayText: 'State' },
    { columnName: 'town', displayText: 'Town' },
    { columnName: 'email', displayText: 'Email' },
  ];

  sortableColumnContacts = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'name', displayText: 'Name' },
    { columnName: 'position', displayText: 'Position' },
    { columnName: 'phoneNo', displayText: 'Phone No' },
    { columnName: 'email', displayText: 'Email' },
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
    private companyContactService: CompanyContactService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService,
    private companyDetailService:CompanyDetailService

  ) { }

  ngOnInit() {
    this.userRole = this.sharedService.role
    this.getCompany()
  }

  getCompany() {
    setTimeout(() => {
      this.route.params.subscribe((routeParams) => {
        if (routeParams['id'] != null) {
          this.companyId = routeParams['id']
          const getOneCompany = this.myLesenService.getOneCompany(routeParams['id'])
            .subscribe(
              Response => {
                this.company = Response
                this.getContact()
                this.getCompanyDetail()
                this.isLoading = false
              }
            )
          this.subscriptionService.add(getOneCompany);
        }
      });
    }, 2000)
  }

  getCompanyDetail(){
    const getCompanyDetail = this.companyDetailService.getCompanyDetailByCompanyId(this.companyId)
    .subscribe(
      Response =>{
        if(Response){
          this.companyDetail = Response
        }
      }
    )
    this.subscriptionService.add(getCompanyDetail);

  }

  getContact() {
    const getContact = this.companyContactService.getCompanyContact()
      .subscribe(
        Response => {
          const contacts = Response
          this.contacts = contacts.filter(x => x.companyId == this.company.id)
        }
      )
    this.subscriptionService.add(getContact);
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
        Response => {
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

  openDialog(company: Company, companyDetail: CompanyDetail) {
    const dialogRef = this.dialog.open(EditCompanyDetailComponent, {
      data: { data: company, companyDetail: companyDetail },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

  openDialogCompanyContact(contact: CompanyContact[], company: Company) {
    const dialogRef = this.dialog.open(ContactDetailComponent, {
      data: { contact: contact, companyId: company.id },
    })
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }


}
