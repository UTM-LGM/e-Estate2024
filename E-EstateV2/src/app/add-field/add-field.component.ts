import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Field } from '../_interface/field';
import swal from 'sweetalert2';
import { FieldStatus } from '../_interface/fieldStatus';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';
import { FieldService } from '../_services/field.service';
import { SharedService } from '../_services/shared.service';
import { Clone } from '../_interface/clone';
import { CloneService } from '../_services/clone.service';
import { FieldStatusService } from '../_services/field-status.service';
import { Location } from '@angular/common';
import { FieldGrant } from '../_interface/fieldGrant';
import { SpinnerService } from '../_services/spinner.service';
import { FieldGrantAttachmentComponent } from '../field-grant-attachment/field-grant-attachment.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.css']
})
export class AddFieldComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef;
  
  fields: Field[] = []
  field: Field = {} as Field

  fieldGrant: FieldGrant = {} as FieldGrant

  cropCategories: FieldStatus[] = []
  filterCropCategories: FieldStatus[] = []
  abandoned : any []=[]
  abandonedInput = false

  selectedValues: any[] = []

  estate: any = {} as any

  clones: Clone[] = []
  filterClones: Clone[] = []
  availableClones: Clone[] = []
  addedGrant: any[] = []

  selectedFile: File[] = []


  rubberArea = ''
  conversion = false
  isSubmit = false
  isLoading = true

  pageNumber = 1
  itemsPerPage = 10


  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private fieldService: FieldService,
    private sharedService: SharedService,
    private cloneService: CloneService,
    private fieldStatusService: FieldStatusService,
    private location: Location,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
  ) { }


  ngOnInit() {
    this.abandonedInput = false
    this.getEstate()
    this.getClone()
    this.getCrop()
  }

  getClone() {
    const getClone = this.cloneService.getClone()
      .subscribe(Response => {
        this.clones = Response
        this.filterClones = this.clones.filter((e) => e.isActive == true)
        this.availableClones = this.filterClones
      });
    this.subscriptionService.add(getClone);

  }

  onFileSelected(event: any) {
    this.selectedFile = Array.from(event.target.files);
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

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          const getOneEstate = this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.getField()
                this.isLoading = false
              })
          this.subscriptionService.add(getOneEstate);
        }
      });
    }, 2000)
  }

  getCrop() {
    const getCrop = this.fieldStatusService.getFieldStatus()
      .subscribe(
        Response => {
          this.cropCategories = Response
        });
    this.subscriptionService.add(getCrop);
  }

  getField() {
    const getField = this.fieldService.getFieldByEstateId(this.estate.id)
      .subscribe(
        Response => {
          this.fields = Response
        }
      )
    this.subscriptionService.add(getField);
  }

  getcategory() {
    this.filterCropCategories = this.cropCategories.filter(c => c.isMature == this.field.isMature
      && c.isActive == true
      && !(c.fieldStatus?.toLowerCase().includes("conversion") && c.isMature == true))
  }

  rubberAreaInput() {
    if (this.field.area <= 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rubber area cannot be less than 0',
      });
      this.field.area = 0
    }
    if (this.rubberArea == "yes") {
      this.field.rubberArea = this.field.area
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

  areaRemark() {
    if (this.field.rubberArea != null) {
      if (this.field.rubberArea <= 0) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Rubber area cannot be less than 0',
        });
        this.field.rubberArea = 0
      }

    }
    if (this.field.rubberArea != null && this.field.rubberArea > this.field.area) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rubber area cannot be more than field area',
      });
      this.field.rubberArea = null
    }
  }

  yearSelected() {
    const yearAsString = this.field.yearPlanted.toString()
    if (yearAsString.length !== 4) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.field.yearPlanted = ''
    }

  }

  checkDOT() {
    if (this.field.yearPlanted && this.field.dateOpenTapping) {
      const yearPlanted = this.field.yearPlanted;
      const dateOpenTappingYear = new Date(this.field.dateOpenTapping).getFullYear();

      if (dateOpenTappingYear < parseInt(yearPlanted) + 5) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Date Open Tapping cannot be 5 year less than Year Planted',
        });
        this.field.dateOpenTapping = null; // Resetting the dateOpenTapping field
      }
    }
  }


  onSubmit() {
    if (
      !this.field.fieldName ||  // Checks if fieldName is empty, null, or undefined
      !this.field.isMature && this.field.isMature !== false ||  // Checks if isMature is undefined or false
      !this.field.fieldStatusId ||  // Checks if fieldStatusId is undefined, null, or empty
      (!this.field.remark && this.rubberArea === 'no') ||  // Checks if remark is undefined or empty and rubberArea is 'no'
      !this.field.rubberArea // Checks if rubberArea is undefined or empty
    ) {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
      this.isSubmit = false;    
    } 
    else if(this.field.isMature == true && !this.field.dateOpenTapping && this.abandonedInput == false)
    {
      swal.fire({
        text: 'Please fill up date open tapping',
        icon: 'error'
      });
    }
    
    else if(this.selectedValues.length == 0 && this.abandonedInput == false){
      swal.fire({
        text: 'Please insert at least 1 clone',
        icon: 'error'
      });
    } 
    
    else {
      this.isSubmit = true
      this.spinnerService.requestStarted();
      this.field.estateId = this.estate.id;
      this.field.isActive = true;
      this.field.createdBy = this.sharedService.userId.toString();
      this.field.createdDate = new Date();
      if (this.field.dateOpenTapping) {
        this.field.dateOpenTapping = this.convertToDateTime(this.field.dateOpenTapping);
      } else {
        this.field.dateOpenTapping = null;
      }

      const combineClone: any[] = this.selectedValues.map(item => {
        return { 'cloneId': item.id, 'isActive': true, 'fieldId': 0, 'createdBy': this.sharedService.userId.toString(), 'createdDate': new Date() };
      });

      const combineLandTitle: any[] = this.addedGrant.map((item: any) => {
        return { 'grantTitle': item.grantTitle.toUpperCase(), 'grantArea': item.grantArea, 'grantRubberArea': item.grantRubberArea, 'isActive': true, 'fieldId': 0, 'createdBy': this.sharedService.userId.toString(), 'createdDate': new Date() };
      });

      this.fieldService.addFieldWithDetails(this.field, combineClone, combineLandTitle).subscribe({
        next: (response: any) => {
          // Assuming response contains fieldGrantIds
          const fieldGrantIds = response.fieldGrantIds;

          if (this.selectedFile.length > 0) {
            this.fieldService.addFieldAttachments(fieldGrantIds, this.selectedFile, this.sharedService.userId).subscribe({
              next: () => {
                swal.fire({
                  title: 'Done!',
                  text: 'Field and attachments successfully submitted!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
                this.selectedValues = [];
                this.addedGrant = [];
                this.field = {} as Field;
                this.ngOnInit();
                this.rubberArea = '';
                this.isSubmit = false;
                this.spinnerService.requestEnded();
              },
              error: (err: any) => {
                swal.fire({
                  text: 'Failed to upload attachments',
                  icon: 'error'
                });
                this.isSubmit = false;
                this.spinnerService.requestEnded();
              }
            });
          } else {
            swal.fire({
              title: 'Done!',
              text: 'Field successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.selectedValues = [];
            this.addedGrant = [];
            this.field = {} as Field;
            this.ngOnInit();
            this.rubberArea = '';
            this.isSubmit = false;
            this.spinnerService.requestEnded();
          }
        },
        error: (err: any) => {
          swal.fire({
            text: 'Failed to submit field data',
            icon: 'error'
          });
          this.isSubmit = false;
          this.spinnerService.requestEnded();
        }
      });
    }
  }



  convertToDateTime(monthYear: string): string {
    // monthYear is in the format YYYY-MM
    const [year, month] = monthYear.split('-').map(Number);
    // Set the date to the first day of the selected month, time to midnight UTC
    const date = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    return date.toISOString(); // Convert to ISO string
  }


  selectedClone(value: Field) {
    if (this.field.cloneId == 0) {
      swal.fire({
        text: 'Please choose clone',
        icon: 'error'
      })
    }
    else {
      const item = this.filterClones.find((x) => x.id == value.cloneId)
      this.selectedValues.push(item)
      this.field.cloneId = 0
      this.availableClones = this.filterClones.filter(x => !this.selectedValues.includes(x))
    }
  }

  delete(index: number) {
    this.selectedValues.splice(index, 1)
    this.availableClones = this.filterClones.filter(x => !this.selectedValues.includes(x))
  }

  back() {
    this.location.back()
  }

  selectedGrant(fieldGrant: FieldGrant) {
    if (fieldGrant.grantRubberArea == null) {
      swal.fire({
        text: 'Please fill up grant title',
        icon: 'error'
      });
    } else {
      // Calculate the total grantRubberArea
      const totalGrantRubberArea = this.addedGrant.reduce((sum, grant) => sum + grant.grantRubberArea, 0);

      // Check if the totalGrantRubberArea exceeds the rubberArea
      if (this.field.rubberArea != null && totalGrantRubberArea + fieldGrant.grantRubberArea > this.field.rubberArea) {
        swal.fire({
          text: 'Total Rubber Area for grants exceeds the Rubber Area',
          icon: 'error'
        });
      } else {
        const grantInfo = {
          grantTitle: fieldGrant.grantTitle,
          grantArea: fieldGrant.grantArea,
          grantRubberArea: fieldGrant.grantRubberArea,
          files: this.selectedFile
        };

        this.addedGrant.push(grantInfo);
        this.fieldGrant.grantTitle = '';
        this.fieldGrant.grantArea = null;
        this.fieldGrant.grantRubberArea = null;
        this.fileInput.nativeElement.value = '';
      }
    }
  }


  deleteGrant(index: number) {
    this.addedGrant.splice(index, 1)
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  viewDocuments(files: File[]) {
    const dialogRef = this.dialog.open(FieldGrantAttachmentComponent, {
      width: '80%',
      data: { files, isUpdating: false }
    });
  
    dialogRef.componentInstance.filesUpdated.subscribe((updatedFiles: File[]) => {
      this.updateGrantFiles(updatedFiles);
    });
  }
  

  updateGrantFiles(updatedFiles: File[]): void {
    // Find the index of the grant in the addedGrant array
    const index = this.addedGrant.findIndex(grant => grant.files === this.selectedFile);

    if (index !== -1) {
      // Update the files for the specific grant
      this.addedGrant[index].files = updatedFiles;
    }

    // Also update the selectedFile if needed
    this.selectedFile = updatedFiles;
  }

  checkStatus(){
    this.abandoned = this.cropCategories.filter(x=>x.fieldStatus.toLowerCase().includes('abandoned') || x.fieldStatus.toLowerCase().includes('acquired'))
    if(this.abandoned.some(category => category.id === this.field.fieldStatusId)){
      this.abandonedInput = true
    }
    else{
      this.abandonedInput = false
    }
  }

  checkTreeInitial(){
    if(this.field.initialTreeStand > 800){
      swal.fire({
        text: 'Initial Tree Stand cannot be more than 800',
        icon: 'error'
      });
      this.field.initialTreeStand = 0
    }
      else if (!Number.isInteger(this.field.initialTreeStand)) {
        swal.fire({
          text: 'Initial Tree Stand cannot have decimal points',
          icon: 'error'
        });
        this.field.initialTreeStand = Math.floor(this.field.initialTreeStand); // Round down to the nearest integer
      }
  }

  checkTreeCurrent(){
    if(this.field.currentTreeStand > 800){
      swal.fire({
        text: 'Current Tree Stand cannot be more than 800',
        icon: 'error'
      });
      this.field.currentTreeStand = 0
    }
    else if(this.field.currentTreeStand > this.field.initialTreeStand){
      swal.fire({
        text: 'Current Tree Stand cannot be more than Initial Tree Stand',
        icon: 'error'
      });
      this.field.currentTreeStand = 0
    }
    else if (!Number.isInteger(this.field.currentTreeStand)) {
      swal.fire({
        text: 'Current Tree Stand cannot have decimal points',
        icon: 'error'
      });
      this.field.currentTreeStand = Math.floor(this.field.currentTreeStand); // Round down to the nearest integer
    }
    
  }
}
