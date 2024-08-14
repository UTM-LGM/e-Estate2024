import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Field } from '../_interface/field';
import { DatePipe } from '@angular/common';
import { FieldStatus } from '../_interface/fieldStatus';
import { Clone } from '../_interface/clone';
import swal from 'sweetalert2';
import { FieldClone } from '../_interface/fieldClone';
import { Location } from '@angular/common';
import { SharedService } from '../_services/shared.service';
import { FieldConversion } from '../_interface/fieldConversion';
import { FieldService } from '../_services/field.service';
import { FieldStatusService } from '../_services/field-status.service';
import { CloneService } from '../_services/clone.service';
import { FieldConversionService } from '../_services/field-conversion.service';
import { FieldCloneService } from '../_services/field-clone.service';
import { FieldDiseaseService } from '../_services/field-disease.service';
import { FieldDisease } from '../_interface/fieldDisease';
import { FieldInfected } from '../_interface/fieldInfected';
import { FieldInfectedService } from '../_services/field-infected.service';
import { OtherCrop } from '../_interface/otherCrop';
import { OtherCropService } from '../_services/other-crop.service';
import { SubscriptionService } from '../_services/subscription.service';
import { FieldGrantService } from '../_services/field-grant.service';
import { FieldGrant } from '../_interface/fieldGrant';

@Component({
  selector: 'app-field-detail',
  templateUrl: './field-detail.component.html',
  styleUrls: ['./field-detail.component.css'],
})
export class FieldDetailComponent implements OnInit, OnDestroy {
  field: Field = {} as Field
  filteredFields: any = {}

  fields: Field[] = []

  fieldClone: FieldClone = {} as FieldClone
  fieldConversion: FieldConversion = {} as FieldConversion

  fieldInfect: FieldInfected = {} as FieldInfected

  selected: FieldStatus = {} as FieldStatus

  fieldStatus: FieldStatus[] = []
  filterFieldStatus: FieldStatus[] = []

  fieldClones: FieldClone[] = []
  availableClones: Clone[] = []
  clones: Clone[] = []
  filterClones: Clone[] = []
  selectedValues: FieldClone[] = []

  filterFieldDisease: FieldDisease[] = []

  filterFieldInfected: FieldInfected[] = []

  fieldSick = false
  dataRows: any[] = [{ year: null, currentTreeStand: null }]

  formattedDate = ''
  conversion = false
  conversionButton = false
  updateConversionBtn = false
  disableInput = false
  isLoading = true
  onInit = true
  fieldInfecteds = false
  fieldInfectedStatus = false
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  itemsPerPage = 2
  term = ''
  rubberArea = ''


  otherCrops: OtherCrop[] = []

  fieldGrants: FieldGrant[] = []
  fieldGrant = {} as FieldGrant

  sortableColumn = [
    { columnName: 'dateInfected', displayText: 'Date Infected' },
    { columnName: 'fieldName', displayText: 'Field / Block' },
    { columnName: 'area', displayText: 'Field Area (Ha)' },
    { columnName: 'areaInfected', displayText: 'Area Infected (Ha)' },
    { columnName: 'fieldDiseaseName', displayText: 'Field Disease Name' },
    { columnName: 'severityLevel', displayText: 'Level Infected' },
    { columnName: 'dateRecovered', displayText: 'Date Recovered' },
    { columnName: 'remark', displayText: 'Remark' },
  ];

  constructor(
    private route: ActivatedRoute,
    private fieldService: FieldService,
    private datePipe: DatePipe,
    private fieldStatusService: FieldStatusService,
    private cloneService: CloneService,
    private fieldConversionService: FieldConversionService,
    private location: Location,
    private sharedService: SharedService,
    private fieldCloneService: FieldCloneService,
    private fieldDiseaseService: FieldDiseaseService,
    private fieldInfectedService: FieldInfectedService,
    private otherCropService: OtherCropService,
    private subscriptionService: SubscriptionService,
    private fieldGrantService: FieldGrantService
  ) { }

  ngOnInit() {
    this.onInit = true
    this.getOneField()
    this.getFieldDisease()
    this.getField()
    this.getOtherCrop()
  }

  getOtherCrop() {
    const getOtherCrop = this.otherCropService.getOtherCrop()
      .subscribe(
        Response => {
          this.otherCrops = Response.filter(x => x.isActive == true)
        }
      )
    this.subscriptionService.add(getOtherCrop);
  }

  getOneField() {
    this.route.params.subscribe((routeParams) => {
      if (routeParams['id'] != null) {
        const getOneField = this.fieldService.getOneField(routeParams['id'])
          .subscribe(
            Response => {
              this.field = Response
              this.getGrant()
              this.getClone()

              if (this.field.rubberArea == this.field.area) {
                this.rubberArea = 'yes'
              }
              else {
                this.rubberArea = 'no'
              }
              this.isLoading = false
              this.getcategory(this.field)
              this.field.cloneId = null;
              this.fieldClones = Response.fieldClones
              this.getDate(Response.dateOpenTapping)
              this.getFieldInfected()
            });
        this.subscriptionService.add(getOneField);

      }
    })
  }

  getFieldInfected() {
    const getFieldInfected = this.fieldInfectedService.getFieldInfectedById(this.field.id)
      .subscribe(
        Response => {
          this.filterFieldInfected = Response
          const inActiveInfection = this.filterFieldInfected.filter(x => x.isActive == false)
          const activeInfection = this.filterFieldInfected.filter(x => x.isActive == true)
          if (this.filterFieldInfected.length > 0) {
            this.fieldInfectedStatus = true
            this.fieldInfecteds = true
            if (inActiveInfection.length > 0 && activeInfection.length == 0) {
              this.fieldInfectedStatus = false
            }
          }
        }
      )
    this.subscriptionService.add(getFieldInfected);

  }

  getField() {
    const getField = this.fieldService.getField()
      .subscribe(
        Response => {
          const fields = Response
          this.fields = fields.filter(x => x.estateId == this.sharedService.estateId)
        }
      )
    this.subscriptionService.add(getField);

  }

  checkFieldStatus() {
    const conversionField = this.field.fieldStatuses.map(x => x.fieldStatus?.toLowerCase().includes("conversion"))
    const convert = this.filterFieldStatus.find(x => x.fieldStatus?.toLowerCase().includes("conversion"))
    if (this.field.conversionId != 0 && this.field.fieldStatusId == convert?.id && conversionField) {
      this.conversion = true
      this.updateConversionBtn = true
    }
    else {
      this.conversion = false
    }
  }

  getDate(date: string | null) {
    this.formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd') || ''
    this.field.dateOpenTapping = this.formattedDate.toString()
  }

  getcategory(field: Field) {
    const getFieldStatus = this.fieldStatusService.getFieldStatus()
      .subscribe(
        Response => {
          if (this.onInit == true) {
            this.fieldStatus = Response
            this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == field.isMature && c.isActive == true)
            this.checkFieldStatus()
            this.onInit = false
          }
          else {
            this.field.fieldStatusId = 0
            this.filterFieldStatus = this.fieldStatus.filter(c => c.isMature == this.field.isMature && c.isActive == true)
          }
        });
    this.subscriptionService.add(getFieldStatus);
  }

  checkDOT() {
    if (this.field.yearPlanted && this.field.dateOpenTappingFormatted) {
      const yearPlanted = this.field.yearPlanted;
      const dateOpenTappingYear = new Date(this.field.dateOpenTappingFormatted).getFullYear();

      if (dateOpenTappingYear < parseInt(yearPlanted) + 5) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Date Open Tapping cannot be 5 year less than Year Planted',
        });
        this.field.dateOpenTappingFormatted = ''; // Resetting the dateOpenTapping field
      }
    }
  }

  updateField(field: Field) {
    if (field.rubberArea == null || (field.remark == null && this.rubberArea == 'no')) {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else {
      // Prepare updated field object
      const updatedField: Field = {
        ...field, // Copy existing field properties
        updatedBy: this.sharedService.userId.toString(),
        updatedDate: new Date()
      };

      // Handle dateOpenTappingFormatted and isMature logic
      if (updatedField.dateOpenTappingFormatted) {
        updatedField.dateOpenTapping = this.convertToDateTime(updatedField.dateOpenTappingFormatted);
      } else if (updatedField.isMature === false) {
        updatedField.dateOpenTapping = null;
      }

      // Prepare updated clones
      const updatedClones: any[] = this.fieldClones.map(clone => ({
        ...clone,
        isActive: true, // Set isActive as needed based on your logic
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date(),
        fieldId: field.id // Assuming field.id is the identifier of the main field
      }));

      // Prepare updated grants
      const updatedGrants: any[] = this.fieldGrants.map(grant => ({
        ...grant,
        isActive: true, // Set isActive as needed based on your logic
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date(),
        fieldId: field.id // Assuming field.id is the identifier of the main field
      }));

      // Perform the update operation
      this.fieldService.updateFieldWithDetails(updatedField, updatedClones, updatedGrants)
        .subscribe(
          () => {
            swal.fire({
              title: 'Done!',
              text: 'Field successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.ngOnInit(); // Refresh data as needed
          },
          error => {
            swal.fire({
              text: 'Error updating field',
              icon: 'error'
            });
          }
        );
    }
  }


  convertToDateTime(monthYear: string): string {
    // monthYear is in the format YYYY-MM
    const [year, month] = monthYear.split('-').map(Number);
    // Set the date to the first day of the selected month, time to midnight
    const date = new Date(year, month, 1, 0, 0, 0); // Adjust month without -1
    return date.toISOString(); // Convert to ISO string or any other desired format
  }

  rubberAreaInput() {
    if (this.rubberArea == "yes") {
      this.field.rubberArea = this.field.area
    }
  }


  updateConversion(field: Field) {
    this.fieldConversion.id = field.conversionId
    this.fieldConversion.sinceYear = field.sinceYear
    this.fieldConversion.updatedBy = this.sharedService.userId.toString()
    this.fieldConversion.updatedDate = new Date()
    this.fieldConversion.otherCropId = this.field.otherCropId
    this.fieldConversionService.updateConversion(this.fieldConversion)
      .subscribe(
        Response => {
          field.updatedBy = this.sharedService.userId.toString()
          field.updatedDate = new Date()
          const { fieldStatus, ...newFields } = this.field
          this.filteredFields = newFields
          this.fieldService.updateField(this.filteredFields)
            .subscribe(
              Response => {
                swal.fire({
                  title: 'Done!',
                  text: 'Conversion field successfully updated!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
              }
            )
        })
  }

  getClone() {
    const getClone = this.cloneService.getClone()
      .subscribe(
        Response => {
          this.clones = Response
          this.filterClones = this.clones.filter((e) => e.isActive == true)
          this.updateAvailableClones();
        });
    this.subscriptionService.add(getClone);
  }

  updateAvailableClones() {
    // Filter out clones that are already selected (fieldClones)
    this.availableClones = this.filterClones.filter(clone =>
      !this.fieldClones.some(selectedClone => selectedClone.cloneId === clone.id)
    );
  }

  getGrant() {
    const getGrant = this.fieldGrantService.getFieldGrantByFieldId(this.field.id)
      .subscribe(
        Response => {
          this.fieldGrants = Response.filter(g => g.isActive == true)
        }
      )
    this.subscriptionService.add(getGrant);

  }

  status(field: Field) {
    field.updatedBy = this.sharedService.userId.toString()
    field.updatedDate = new Date()
    field.isActive = !field.isActive
    const { fieldStatus, ...newFields } = this.field
    this.filteredFields = newFields
    this.fieldService.updateField(this.filteredFields)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Field Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
        }
      );
  }

  addClone(field: Field) {
    if (!field.cloneId) {
      swal.fire({
        text: 'Please choose a clone',
        icon: 'error'
      });
      return; // Exit early if cloneId is not selected
    }

    // Find the selected clone object from availableClones based on cloneId
    const selectedClone = this.availableClones.find(clone => clone.id === field.cloneId);

    if (selectedClone) {
      // Create a new clone object
      const newClone: any = {
        id: 0,  // This will be assigned by the backend when saved
        cloneId: selectedClone.id,
        cloneName: selectedClone.cloneName,
        fieldId: field.id, // Assuming field.id is the current field's ID
        isActive: true, // Set default values as needed
        createdBy: this.sharedService.userId.toString(),
        createdDate: new Date()
      };

      // Add the new clone object to the fieldClones array
      this.fieldClones.push(newClone);

      // Optionally, clear or reset the field.cloneId if needed
      field.cloneId = null;
      this.availableClones = this.availableClones.filter(clone => clone.id !== selectedClone.id);

      swal.fire({
        title: 'Done!',
        text: 'Clone successfully added!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }



  changeFieldStatus(fieldStatusId: any) {
    this.checkDisease(fieldStatusId)
    const conversionItem = this.filterFieldStatus.find(x => x.fieldStatus?.toLowerCase().includes("conversion") && !x.fieldStatus?.toLowerCase().includes("rubber"))
    if (fieldStatusId.value == conversionItem?.id && this.field.conversionId == 0) {
      this.conversion = true
      this.conversionButton = true
    }
    else if (fieldStatusId.value == conversionItem?.id) {
      this.conversion = true
      this.updateConversionBtn = true
    }
    else {
      this.conversion = false
      this.conversionButton = false
      this.updateConversionBtn = false
    }
  }

  checkDisease(fieldStatusId: any) {
    if (this.field.isMature == true) {
      const infected = this.fieldStatus.find(x => x.fieldStatus?.toLowerCase().includes("infected") && x.isMature == true);
      if (fieldStatusId.value == infected?.id) {
        this.fieldSick = true
      }
      else {
        this.fieldSick = false
      }
    }
    else if (this.field.isMature == false) {
      const infected = this.fieldStatus.find(x => x.fieldStatus?.toLowerCase().includes("infected") && x.isMature == false);
      if (fieldStatusId.value == infected?.id) {
        this.fieldSick = true
      }
      else {
        this.fieldSick = false
      }
    }
  }

  delete(index: number) {
    // {
    //   swal.fire({
    //     title: "Are you sure to delete ?",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes',
    //     denyButtonText: 'Cancel'
    //   })
    //     .then((result) => {
    //       if (result.isConfirmed) {
    //         this.fieldService.deleteClone(cloneId, fieldId)
    //           .subscribe(
    //             Response => {
    //               swal.fire({
    //                 title: 'Deleted!',
    //                 text: 'Clone has been deleted!',
    //                 icon: 'success',
    //                 showConfirmButton: false,
    //                 timer: 1000
    //               });
    //               this.ngOnInit()
    //             }
    //           )
    //       } else if (result.isDenied) {
    //       }
    //     });
    // }

    this.fieldClones.splice(index, 1)
    // console.log(this.fieldClones)
    this.updateAvailableClones();

    swal.fire({
      title: 'Deleted!',
      text: 'Clone has been deleted!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    });

  }

  deleteGrant(index: number) {
    // {
    //   swal.fire({
    //     title: "Are you sure to delete ?",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes',
    //     denyButtonText: 'Cancel'
    //   })
    //     .then((result) => {
    //       if (result.isConfirmed) {
    //         this.fieldGrantService.deleteGrant(grantId)
    //           .subscribe(
    //             Response => {
    //               swal.fire({
    //                 title: 'Deleted!',
    //                 text: 'Grant has been deleted!',
    //                 icon: 'success',
    //                 showConfirmButton: false,
    //                 timer: 1000
    //               });
    //               this.ngOnInit()
    //             })
    //       } else if (result.isDenied) {
    //       }
    //     });
    // }

    this.fieldGrants.splice(index, 1)
    swal.fire({
      title: 'Deleted!',
      text: 'Grant has been deleted!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    });
  }

  back() {
    this.location.back()
  }

  convertField(field: Field) {
    this.fieldConversion.fieldId = this.field.id
    this.fieldConversion.sinceYear = this.field.sinceYear
    this.fieldConversion.createdBy = this.sharedService.userId.toString()
    this.fieldConversion.createdDate = new Date()
    this.fieldConversion.otherCropId = this.field.otherCropId
    this.fieldConversionService.addConversion(this.fieldConversion)
      .subscribe(
        Response => {
          this.fieldCloneService.updateFieldClone(this.filteredFields)
            .subscribe(
              Response => {
                field.updatedBy = this.sharedService.userId.toString()
                field.updatedDate = new Date()
                const { fieldStatus, ...newFields } = this.field
                this.filteredFields = newFields
                this.fieldService.updateField(this.filteredFields)
                  .subscribe(
                    Response => {
                      swal.fire({
                        title: 'Done!',
                        text: 'Field successfully converted!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                      });
                      this.ngOnInit()
                    }
                  )
              }
            )
        }
      )
    this.updateConversionBtn = true
    this.conversionButton = false
    this.disableInput = true
  }

  getFieldDisease() {
    const getFieldDisease = this.fieldDiseaseService.getFieldDisease()
      .subscribe(
        Response => {
          const fieldDisease = Response
          this.filterFieldDisease = fieldDisease.filter(e => e.isActive == true)
        }
      )
    this.subscriptionService.add(getFieldDisease);

  }

  fieldInfected(field: Field) {
    this.fieldInfect.fieldId = this.field.id
    this.fieldInfect.areaInfected = this.field.areaInfected
    this.fieldInfect.fieldDiseaseId = this.field.fieldDiseaseId
    this.fieldConversion.createdBy = this.sharedService.userId.toString()
    this.fieldConversion.createdDate = new Date()
  }

  checkFieldName() {
    if (this.fields.some((s: any) => s.fieldName.toLowerCase() === this.field.fieldName.toLowerCase())) {
      swal.fire({
        text: 'Field/Block Name already exists!',
        icon: 'error'
      });
      this.field.fieldName = ''
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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  areaRemark() {
    if (this.field.rubberArea != null && this.field.rubberArea > this.field.area) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rubber area cannot be more than field area',
      });
      this.field.rubberArea = null
    }
  }

  onRadioChange() {
    if (this.rubberArea === 'yes') {
      this.field.rubberArea = this.field.area;
    }
    else {
      this.field.rubberArea = null
    }
  }

  addGrant(fieldGrant: FieldGrant) {
    if (fieldGrant.grantRubberArea == null) {
      swal.fire({
        text: 'Please insert grant title',
        icon: 'error'
      });
    } else {
      const totalGrantRubberArea = this.fieldGrants.reduce((sum, grant) => {
        // Ensure grantRubberArea is a number before adding to sum
        const area = grant.grantRubberArea || 0; // Use 0 if grantRubberArea is null or undefined
        return sum + area;
      }, 0);

      if (this.field.rubberArea != null && totalGrantRubberArea + fieldGrant.grantRubberArea > this.field.rubberArea) {
        swal.fire({
          text: 'Total Rubber Area for grants exceeds the Rubber Area',
          icon: 'error'
        });
      }
      else {
        const newGrant: any = {
          id: 0,  // This will be assigned by the backend when saved
          grantTitle: fieldGrant.grantTitle,
          grantArea: fieldGrant.grantArea,
          grantRubberArea: fieldGrant.grantRubberArea, // Assuming field.id is the current field's ID
          isActive: true, // Set default values as needed
          createdBy: this.sharedService.userId.toString(),
          createdDate: new Date()
        };
        this.fieldGrants.push(newGrant)
        swal.fire({
          title: 'Done!',
          text: 'Grant successfully added!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.fieldGrant.grantTitle = ''
        this.fieldGrant.grantArea = null
        this.fieldGrant.grantRubberArea = null
      }
      //   fieldGrant.fieldId = this.field.id
      //   fieldGrant.createdBy = this.sharedService.userId.toString()
      //   fieldGrant.createdDate = new Date()
      //   this.fieldGrantService.addFieldGrant(fieldGrant)
      //     .subscribe(
      //       Response => {
      //         swal.fire({
      //           title: 'Done!',
      //           text: 'Grant successfully added!',
      //           icon: 'success',
      //           showConfirmButton: false,
      //           timer: 1000
      //         });
      //         this.ngOnInit()
      //         this.fieldGrant.grantTitle = ''
      //         this.fieldGrant.grantArea = null
      //         this.fieldGrant.grantRubberArea = null
      //       }
      //     )
    }
  }

  calculateIndex(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }

  onPageChange(newPageNumber: number) {
    // Ensure the page number is not less than 1
    if (newPageNumber < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = newPageNumber;
    }
  }

  yearSelected() {
    if (this.field.sinceYear != null) {
      const yearAsString = this.field.sinceYear.toString()
      if (yearAsString?.length !== 4) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please insert correct year',
        });
        this.field.sinceYear = 0
      }
    }


  }


}

