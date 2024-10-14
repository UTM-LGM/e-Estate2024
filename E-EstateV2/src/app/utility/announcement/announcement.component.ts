import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Announcement } from 'src/app/_interface/annoucement';
import { AnnoucementService } from 'src/app/_services/annoucement.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { environment } from 'src/environments/environments';
import swal from 'sweetalert2';
import { EditHierarchyComponent } from './edit-hierarchy/edit-hierarchy.component';


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit, OnDestroy {

  announcement = {} as Announcement
  announcements: Announcement[] = []
  selectedFile: File | null = null
  term = ''
  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1
  itemsPerPage = 10

  baseUrl = environment.apiUrl

  sortableColumns = [
    { columnName: 'tittle', displayText: 'Tittle' },
    { columnName: 'hierarchy', displayText: 'Hierarchy (Order No)' },
    { columnName: 'filePath', displayText: 'Image' },
  ];

  constructor(
    private announcementService: AnnoucementService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getAnnouncement()
    this.announcement.tittle = ''
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
  }

  submit() {
    if (this.announcement.tittle === '') {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if (this.announcements.some(s => s.tittle.toLowerCase() === this.announcement.tittle.toLowerCase())) {
      swal.fire({
        text: 'Slide announcement already exists!',
        icon: 'error'
      });
    }else if (this.announcements.some(s => s.hierarchy === this.announcement.hierarchy)) {
      swal.fire({
        text: 'Hierarchy already exists!',
        icon: 'error'
      });
    }
    else {
      this.spinnerService.requestStarted()
      this.announcement.isActive = true
      this.announcement.createdBy = this.sharedService.userId
      if (this.selectedFile != null) {
        this.announcementService.addAnnouncement(this.announcement, this.selectedFile)
          .subscribe(
            Response => {
              swal.fire({
                title: 'Done!',
                text: 'Slide announcement successfully submitted!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
              this.reset()
              this.ngOnInit()
              this.spinnerService.requestEnded()
            })
      }
    }

  }

  reset() {
    this.announcement = {} as Announcement
    this.selectedFile = null
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  getAnnouncement() {
    setTimeout(() => {
      const getAnnouncement = this.announcementService.getAnnouncement()
        .subscribe(
          Response => {
            this.announcements = Response
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getAnnouncement);

    }, 2000)
  }

  status(announcement: Announcement) {
    announcement.updatedBy = this.sharedService.userId
    announcement.updatedDate = new Date()
    announcement.isActive = !announcement.isActive
    this.announcementService.updateAnnouncement(announcement)
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
      )
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  calculateIndex(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }

  onPageChange(newPageNumber: number) {
    if (newPageNumber < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = newPageNumber;
    }
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }

  edit(annoucement:any){
    const dialogRef = this.dialog.open(EditHierarchyComponent, {
      data: { data: annoucement },
    });
    dialogRef.afterClosed()
      .subscribe(
        Response => {
          this.ngOnInit()
        }
      )
  }
  
}
