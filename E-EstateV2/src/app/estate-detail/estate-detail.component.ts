import { Component, OnInit } from '@angular/core';
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
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';
import { EstateContact } from '../_interface/estate-contact';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { EstateContactService } from '../_services/estate-contact.service';

@Component({
  selector: 'app-estate-detail',
  templateUrl: './estate-detail.component.html',
  styleUrls: ['./estate-detail.component.css'],
})
export class EstateDetailComponent implements OnInit {
  estate: Estate = {} as Estate

  contacts:any = {} as any

  value: Field[] = []

  conversionField: FieldConversion[] = [];

  term = ''
  userRole = ''
  pageNumber = 1
  isLoading = true
  order = ''
  currentSortedColumn = ''
  total = 0
  selectedField: any

  sortableColumns = [
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
    { columnName: 'name', displayText: 'Name' },
    { columnName: 'position', displayText: 'Position' },
    { columnName: 'phoneNo', displayText: 'Phone No' },
    { columnName: 'email', displayText: 'Email' },
  ];

  constructor(
    private route: ActivatedRoute,
    private estateService: EstateService,
    private location: Location,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private fieldConversionService: FieldConversionService,
    private auth: AuthGuard,
    private estateContactService:EstateContactService
  ) { }

  ngOnInit() {
    this.userRole = this.auth.getRole()
    this.getEstate()
    this.getContact()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          this.estateService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.sum(this.estate.fields)
                this.isLoading = false
              });
        }
      });
    }, 2000)
  }

  getContact(){
    this.estateContactService.getCompanyContact()
    .subscribe(
      Response =>{
        this.contacts = Response
      }
    )
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

  openDialog(estate: Estate) {
    const dialogRef = this.dialog.open(EditEstateDetailComponent, {
      data: { data: estate },
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
    this.value = data.filter(x => x.isActive == true)
    this.total = this.value.reduce((acc, item) => acc + item.area, 0)
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
    this.fieldConversionService.getConversion()
      .subscribe(
        Response => {
          const conversion = Response
          this.conversionField = conversion.filter(x => x.fieldId == field.id)
        }
      )
  }

  openDialogContact(contact:EstateContact, estate:Estate)
  {
    const dialogRef = this.dialog.open(ContactDetailComponent, {
      data:{contact: contact, estateId: estate.id},
    })
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }

}
