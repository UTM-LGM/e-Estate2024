import { Component, OnDestroy, OnInit } from '@angular/core';
import { Estate } from '../_interface/estate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { State } from '../_interface/state';
import { Town } from '../_interface/town';
import { FinancialYear } from '../_interface/financialYear';
import { Establishment } from '../_interface/establishment';
import { MembershipType } from '../_interface/membership';
import swal from 'sweetalert2';
import { SharedService } from '../_services/shared.service';
import { StateService } from '../_services/state.service';
import { TownService } from '../_services/town.service';
import { FinancialYearService } from '../_services/financial-year.service';
import { MembershipService } from '../_services/membership.service';
import { EstablishmentService } from '../_services/establishment.service';
import { PlantingMaterialService } from '../_services/planting-material.service';
import { PlantingMaterial } from '../_interface/planting-material';
import { EstateDetail } from '../_interface/estate-detail';
import { EstateDetailService } from '../_services/estate-detail.service';
import { SubscriptionService } from '../_services/subscription.service';
import { SpinnerService } from '../_services/spinner.service';
import { RrimgeorubberIntegrationService } from '../_services/rrimgeorubber-integration.service';

@Component({
  selector: 'app-edit-estate-detail',
  templateUrl: './edit-estate-detail.component.html',
  styleUrls: ['./edit-estate-detail.component.css']
})
export class EditEstateDetailComponent implements OnInit, OnDestroy {

  estate: any = {} as any
  filteredEstate: any = {} as any

  estateDetail: EstateDetail = {} as EstateDetail


  filterStates: State[] = []

  towns: Town[] = []
  filterTown: Town[] = []
  filterTowns: Town[] = []

  filterFinancialYears: FinancialYear[] = []

  filterMemberships: MembershipType[] = []

  filterEstablishments: Establishment[] = []

  filterPlantingMaterial: PlantingMaterial[] = []

  town = true

  polygonArea: number[] = []
  polygonTotalArea = 0
  msnrStatus: boolean = false


  constructor(
    public dialog: MatDialogRef<Estate>,
    @Inject(MAT_DIALOG_DATA) public data: { data: Estate, estateDetail: EstateDetail },
    private stateService: StateService,
    private townService: TownService,
    private financialYearService: FinancialYearService,
    private membershipService: MembershipService,
    private establishmentService: EstablishmentService,
    private sharedService: SharedService,
    private plantingMaterialService: PlantingMaterialService,
    private estateDetailService: EstateDetailService,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService,
    private rrimGeoRubberService: RrimgeorubberIntegrationService,
  ) { }

  ngOnInit() {
    this.estate = this.data.data
    this.estateDetail = this.data.estateDetail
    this.getState()
    this.getTown()
    this.getFinancialYear()
    this.getMembership()
    this.getEstablishment()
    this.getPlantingMaterial()
    this.getGeoJson()
  }

  getFinancialYear() {
    const getFinancialYear = this.financialYearService.getFinancialYear()
      .subscribe(
        Response => {
          const financialYears = Response
          this.filterFinancialYears = financialYears.filter(e => e.isActive == true)
        });
    this.subscriptionService.add(getFinancialYear);
  }

  getPlantingMaterial() {
    const getPlantingMaterial = this.plantingMaterialService.getPlantingMaterial()
      .subscribe(
        Response => {
          const plantingMaterial = Response
          this.filterPlantingMaterial = plantingMaterial.filter(p => p.isActive == true)
        }
      )
    this.subscriptionService.add(getPlantingMaterial);

  }

  getMembership() {
    const getMembership = this.membershipService.getMembership()
      .subscribe(
        Response => {
          const memberships = Response
          this.filterMemberships = memberships.filter(e => e.isActive == true)
        });
    this.subscriptionService.add(getMembership);
  }

  getEstablishment() {
    const getEstablishment = this.establishmentService.getEstablishment()
      .subscribe(
        Response => {
          const establishments = Response
          this.filterEstablishments = establishments.filter(e => e.isActive == true)
        });
    this.subscriptionService.add(getEstablishment);
  }

  gettown(event: any) {
    this.estate.townId = 0
    this.filterTown = this.towns.filter(e => e.stateId == event.value)
    this.filterTowns = this.filterTown.filter(e => e.isActive == true)
    this.town = false
  }

  getTown() {
    const getTown = this.townService.getTown()
      .subscribe(
        Response => {
          this.towns = Response
          this.filterTowns = this.towns.filter(e => e.isActive == true)
        });
    this.subscriptionService.add(getTown);
  }

  getState() {
    const getState = this.stateService.getState()
      .subscribe(
        Response => {
          const states = Response
          this.filterStates = states.filter(e => e.isActive == true)
        });
    this.subscriptionService.add(getState);

  }

  back() {
    this.dialog.close()
  }

  update() {
    this.spinnerService.requestStarted();
    this.getGeoJson()
    if (this.estateDetail.id == undefined) {
      // Preparing data for a new estate detail
      this.estateDetail.estateId = this.estate.id;
      this.estateDetail.estateIdOld = this.estate.id;
      this.estateDetail.licenseNo = this.estate.licenseNo;
      this.estateDetail.plantingMaterialId = this.estateDetail.plantingMaterialId;
      this.estateDetail.createdBy = this.sharedService.userId.toString();
      this.estateDetail.createdDate = new Date();
      this.estateDetail.polygonArea = this.polygonTotalArea
      this.estateDetail.msnrStatus = this.msnrStatus

      // Calling service to add estate detail
      this.estateDetailService.addEstateDetail(this.estateDetail)
        .subscribe({
          next: (response) => {
            this.spinnerService.requestEnded();
            swal.fire({
              title: 'Done!',
              text: 'Estate successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close();
          },
          error: (err) => {
            this.spinnerService.requestEnded();
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please fill up the form',
            });
          }
        });

    } else {
      // Preparing data for updating estate detail
      this.estateDetail.plantingMaterialId = this.estateDetail.plantingMaterialId;
      this.estateDetail.updatedBy = this.sharedService.userId.toString();
      this.estateDetail.updatedDate = new Date();

      const { plantingMaterial, ...newObj } = this.estateDetail;
      this.filteredEstate = newObj;

      // Calling service to update estate detail
      this.estateDetailService.updateEstateDetail(this.filteredEstate)
        .subscribe({
          next: (response) => {
            this.spinnerService.requestEnded();
            swal.fire({
              title: 'Done!',
              text: 'Estate successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close();
          },
          error: (err) => {
            this.spinnerService.requestEnded();
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please fill up the form',
            });
          }
        });
    }
  }


  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }


  getGeoJson() {
    if (this.estate.licenseNo != undefined) {
      this.rrimGeoRubberService.getGeoRubber(this.estate.licenseNo)
        .subscribe(
          Response => {
            var features = Response.features;
            if (features != undefined) {
              if (Response.msnrStatus === 'Ya') {
                this.msnrStatus = true;
              } else if (Response.msnrStatus === 'Tidak') {
                this.msnrStatus = false;
              }

              features.forEach((feature: any) => {
                let geometry = feature.geometry;
                let properties = feature.properties

                // Check if the geometry is of type 'Polygon' or 'MultiPolygon'
                if (geometry.type === 'Polygon') {
                  geometry.coordinates.forEach((coordinateSet: any) => {
                    this.polygonArea.push(properties.hectarage_of_marked_polygon);
                  });
                } else if (geometry.type === 'MultiPolygon') {
                  geometry.coordinates.forEach((polygonCoordinates: any) => {
                    polygonCoordinates.forEach((coordinateSet: any) => {
                      this.polygonArea.push(properties.hectarage_of_marked_polygon);
                    });
                  });
                }
              });
            } else {
              this.spinnerService.requestEnded()
              swal.fire({
                text: 'Estate is not listed in RRIM GeoRubber',
                icon: 'error'
              });
            }
            this.polygonTotalArea = this.polygonArea.reduce((acc, currentValue) => acc + currentValue, 0);
          },
          error => {
            // Suppress console log and show a user-friendly error message
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Estate is not listed in RRIM GeoRubber',
            });
          }
        )
    }
    else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot connect to RRIMGeoRubber',
      });
      this.dialog.close();
    }
  }

}
