import { Component, OnInit } from '@angular/core';
import { Establishment } from 'src/app/_interface/establishment';
import { EstablishmentService } from 'src/app/_services/establishment.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.css'],
})
export class EstablishmentComponent implements OnInit {
  establishment: Establishment = {} as Establishment

  establishments: Establishment[] = []

  isLoading = true
  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''

  sortableColumns = [
    { columnName: 'establishment', displayText: 'Establishment' },
  ];


  constructor(
    private establishmentService: EstablishmentService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.getEstablishment()
    this.establishment.establishment = ''
  }

  submit() {
    if (this.establishment.establishment == '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.establishments.some(s => s.establishment.toLowerCase() === this.establishment.establishment.toLowerCase())) {
      swal.fire({
        text: 'Establishment already exists!',
        icon: 'error'
      });
    }
    else {
      this.establishment.isActive = true
      this.establishment.createdBy = this.sharedService.userId.toString()
      this.establishment.createdDate = new Date()
      this.establishmentService.addEstablishment(this.establishment)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Establishment successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          });
    }
  }

  reset() {
    this.establishment = {} as Establishment
  }

  getEstablishment() {
    setTimeout(() => {
      const getEstablishment = this.establishmentService.getEstablishment()
        .subscribe(
          Response => {
            this.establishments = Response
            this.isLoading = false
          });
      this.subscriptionService.add(getEstablishment);

    }, 2000)
  }

  status(establishment: Establishment) {
    establishment.updatedBy = this.sharedService.userId.toString()
    establishment.updatedDate = new Date()
    establishment.isActive = !establishment.isActive
    this.establishmentService.updateEstablishment(establishment)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      );
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

}
