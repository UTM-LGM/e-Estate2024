import { Component, OnInit } from '@angular/core';
import { Establishment } from '../_interface/establishment';
import { Estate } from '../_interface/estate';
import { FinancialYear } from '../_interface/financialYear';
import { MembershipType } from '../_interface/membership';
import { State } from '../_interface/state';
import { Town } from '../_interface/town';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import { TownService } from '../_services/town.service';
import { FinancialYearService } from '../_services/financial-year.service';
import { MembershipService } from '../_services/membership.service';
import { EstablishmentService } from '../_services/establishment.service';
import { StateService } from '../_services/state.service';
import { EstateService } from '../_services/estate.service';

@Component({
  selector: 'app-add-estate',
  templateUrl: './add-estate.component.html',
  styleUrls: ['./add-estate.component.css'],
})
export class AddEstateComponent implements OnInit {
  estate: Estate = {} as Estate

  filterStates: State[] = []

  towns: Town[] = []
  filterTowns: Town[] = []

  filterFinancialYears: FinancialYear[] = []

  filterMemberships: MembershipType[] = []

  filterEstablishments: Establishment[] = []

  constructor(
    private townService: TownService,
    private financialYearService: FinancialYearService,
    private membershipService: MembershipService,
    private establishmentService: EstablishmentService,
    private stateService: StateService,
    private estateService: EstateService,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.initialForm()
    this.getTown()
    this.getFinancialYear()
    this.getMembership()
    this.getEstablishment()
    this.getState()
  }

  initialForm() {
    this.estate.stateId = 0
    this.estate.townId = 0
    this.estate.financialYearId = 0
    this.estate.membershipTypeId = 0
    this.estate.establishmentId = 0
  }

  onSubmit() {
    this.estate.isActive = true
    const id = this.route.snapshot.paramMap.get('id')
    if (id != null) {
      this.estate.companyId = parseInt(id)
    }
    this.estate.createdBy = this.sharedService.userId.toString()
    this.estate.createdDate = new Date()
    this.estate.totalArea = this.estate.totalArea.toString()
    this.estateService.addEstate(this.estate)
      .subscribe(
        {
          next: (Response) => {
            swal.fire({
              title: 'Done!',
              text: 'Estate successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.initialForm()
          },
          error: (err) => {
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please fill up the form',
            });
          }
        })
  }

  reset() {
    this.estate = {} as Estate
  }

  gettownFilter(event: any) {
    const filterTown = this.towns.filter(e => e.stateId == event.value)
    this.filterTowns = filterTown.filter(e => e.isActive == true)
  }

  getTown() {
    this.townService.getTown()
      .subscribe(
        Response => {
          const towns = Response
          this.towns = towns.filter(e => e.isActive == true)
        });
  }

  getFinancialYear() {
    this.financialYearService.getFinancialYear()
      .subscribe(
        Response => {
          const financialYears = Response
          this.filterFinancialYears = financialYears.filter(e => e.isActive == true)
        });
  }

  getMembership() {
    this.membershipService.getMembership()
      .subscribe(
        Response => {
          const memberships = Response
          this.filterMemberships = memberships.filter(e => e.isActive == true)
        });
  }

  getEstablishment() {
    this.establishmentService.getEstablishment()
      .subscribe(
        Response => {
          const establishments = Response
          this.filterEstablishments = establishments.filter(e => e.isActive == true)
        });
  }

  getState() {
    this.stateService.getState()
      .subscribe(
        Response => {
          const states = Response
          this.filterStates = states.filter(e => e.isActive == true)
        });
  }

  back() {
    this.location.back()
  }

  checkEstateName(event: any) {
    this.estateService.checkEstateName(event.target.value.toString())
      .subscribe(
        {
          next: (Response: any) => {

          },
          error: (Error) => {
            swal.fire({
              icon: 'error',
              title: 'Error ! ' + Error.error + ' !',
            });
            this.estate.estateName = ''
          }
        }
      )
  }

}
