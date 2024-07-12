import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Estate } from '../_interface/estate';
import { EstateService } from '../_services/estate.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { EditEstateDetailComponent } from '../edit-estate-detail/edit-estate-detail.component';
import { Field } from '../_interface/field';
import { FieldConversionService } from '../_services/field-conversion.service';
import { FieldConversion } from '../_interface/fieldConversion';
import { EstateContact } from '../_interface/estate-contact';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { EstateContactService } from '../_services/estate-contact.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { EstateDetailService } from '../_services/estate-detail.service';
import { EstateDetail } from '../_interface/estate-detail';
import { FieldService } from '../_services/field.service';
import { FieldInfectedService } from '../_services/field-infected.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-estate-detail',
  templateUrl: './estate-detail.component.html',
  styleUrls: ['./estate-detail.component.css'],
})
export class EstateDetailComponent implements OnInit,OnDestroy {
  estate: any = {} as any

  contacts: any[] = []

  fields: Field[] = []

  value: Field[] = []

  conversionField: FieldConversion[] = [];

  estateDetail: EstateDetail = {} as EstateDetail

  termContact = ''
  termField = ''
  itemsPerPageContact = 5
  itemsPerPageField = 10
  userRole = ''
  contactsPageNumber = 1
  fieldsPageNumber = 1
  isLoading = true
  order = ''
  currentSortedColumn = ''
  total = 0
  selectedField: any
  result: any = {} as any

  sortableColumns = [
    { columnName: 'no', displayText: 'No' },
    { columnName: 'fieldName', displayText: 'Field / Block' },
    { columnName: 'area', displayText: 'Field Area (Ha)' },
    { columnName: 'isMature', displayText: 'Maturity' },
    { columnName: 'fieldStatus', displayText: 'Field Status' },
    { columnName: 'yearPlanted', displayText: 'Year Planted' },
    { columnName: 'dateOpenTapping', displayText: 'Date Open Tapping' },
    { columnName: 'initialTreeStand', displayText: 'Initial Tree Stand' },
    { columnName: 'totalTask', displayText: 'Total Task' }
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
    private estateService: EstateService,
    private location: Location,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private fieldConversionService: FieldConversionService,
    private estateContactService: EstateContactService,
    private myLesenService: MyLesenIntegrationService,
    private estateDetailService: EstateDetailService,
    private fieldService: FieldService,
    private fieldInfectedService: FieldInfectedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.userRole = this.sharedService.role
    this.getEstate()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.getContact()
                this.getField()
                this.isLoading = false
              }
            )
          this.subscriptionService.add(getOneEstate);
       
          const getEstateDetail = this.estateDetailService.getEstateDetailbyEstateId(routerParams['id'])
            .subscribe(
              Response => {
                if (Response != null) {
                  this.estateDetail = Response
                }
              }
            )
            this.subscriptionService.add(getEstateDetail);
        }
      });
    }, 2000)
  }

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const fields = Response
          this.fields = fields.filter(x => x.estateId == this.estate.id)
          // Fetch all field infected data
          this.fieldInfectedService.getFieldInfected().subscribe(
            allFieldInfectedData => {
              // Filter field infected data based on field id and store in result object
              fields.forEach(field => {
                const filteredData = allFieldInfectedData.filter(data => data.fieldId === field.id && data.isActive == true);
                this.result[field.id] = filteredData;

              });
            })
          this.sum(this.fields)
        }
      )
      this.subscriptionService.add(getField);

  }

  getContact() {
    const getContact =this.estateContactService.getCompanyContact()
      .subscribe(
        Response => {
          const contacts = Response
          this.contacts = contacts.filter(x => x.estateId == this.estate.id)
        }
      )
      this.subscriptionService.add(getContact);

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
          this.getEstate()
        }
      );
  }

  statusContact(contact: EstateContact) {
    contact.updatedBy = this.sharedService.userId.toString()
    contact.updatedDate = new Date()
    contact.isActive = !contact.isActive
    this.estateContactService.updateEstateContact(contact)
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

  openDialog(estate: Estate, estateDetail: EstateDetail) {
    const dialogRef = this.dialog.open(EditEstateDetailComponent, {
      data: { data: estate, estateDetail: estateDetail },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  sum(data: Field[]) {
    const filteredFields = data.filter(field => !this.result[field.id]);
    this.value = filteredFields.filter(x => x.isActive && !x.fieldStatus?.toLowerCase().includes('conversion to other crop') && !x.fieldStatus?.toLowerCase().includes('abandoned') && !x.fieldStatus?.toLowerCase().includes('government'));
    this.total = this.value.reduce((acc, item) => acc + item.area, 0);
  }

  toggleSelectedField(field: Field) {
    if (this.selectedField && this.selectedField.id === field.id) {
      this.selectedField = null
    } else {
      this.selectedField = field
      this.getConversion(this.selectedField)
    }
  }

  getConversion(field: Field) {
     const getConversion = this.fieldConversionService.getConversion()
      .subscribe(
        Response => {
          const conversion = Response
          this.conversionField = conversion.filter(x => x.fieldId == field.id)
        }
      )
      this.subscriptionService.add(getConversion);

  }

  openDialogContact(contact: EstateContact[], estate: Estate) {
    const dialogRef = this.dialog.open(ContactDetailComponent, {
      data: { contact: contact, estateId: estate.id },
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
