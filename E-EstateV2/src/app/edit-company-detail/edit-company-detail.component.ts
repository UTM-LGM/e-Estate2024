import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from '../_interface/company';
import { StateService } from '../_services/state.service';
import { TownService } from '../_services/town.service';
import { State } from '../_interface/state';
import { Town } from '../_interface/town';
import { CompanyService } from '../_services/company.service';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { Ownership } from '../_interface/ownership';
import { OwnershipService } from '../_services/ownership.service';


@Component({
  selector: 'app-edit-company-detail',
  templateUrl: './edit-company-detail.component.html',
  styleUrls: ['./edit-company-detail.component.css']
})
export class EditCompanyDetailComponent {

  company: Company = {} as Company
  filterStates: State[] = []
  towns: Town[] = []
  filterTowns: Town[] = []
  filterTown: Town[] = []

  ownership:Ownership[]=[]

  town = true;

  constructor(
    public dialog: MatDialogRef<Company>,
    @Inject(MAT_DIALOG_DATA) public data: { data: Company },
    private stateService: StateService,
    private townService: TownService,
    private companyService: CompanyService,
    private sharedService: SharedService,
    private ownershipService:OwnershipService
  ) { }

  ngOnInit() {
    this.company = this.data.data
    this.getState()
    this.getTown()
    this.getOwnership()
  }

  getState() {
    this.stateService.getState()
      .subscribe(
        Response => {
          const states = Response
          this.filterStates = states.filter(e => e.isActive == true)
        });
  }

  getOwnership(){
    this.ownershipService.getOwnership()
    .subscribe(
      Response=>{
        const ownerships = Response
        this.ownership = ownerships.filter(e=>e.isActive == true)
      }
    )
  }

  gettown(event: any) {
    this.company.townId = 0
    this.filterTown = this.towns.filter(e => e.stateId == event.value)
    this.filterTowns = this.filterTown.filter(e => e.isActive == true)
    this.town = false
  }

  getTown() {
    this.townService.getTown()
      .subscribe(
        Response => {
          this.towns = Response
          this.filterTowns = this.towns.filter(e => e.isActive == true)
        });
  }

  update() {
    this.company.updatedBy = this.sharedService.userId.toString()
    this.company.updatedDate = new Date()
    this.companyService.updateCompany(this.company)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Company successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialog.close()
        }
      )
  }

  back() {
    this.dialog.close()
  }

}
