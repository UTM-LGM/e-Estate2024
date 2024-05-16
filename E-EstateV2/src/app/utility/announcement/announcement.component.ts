import { Component, OnInit } from '@angular/core';
import { Announcement } from 'src/app/_interface/annoucement';
import { AnnoucementService } from 'src/app/_services/annoucement.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { environment } from 'src/environments/environments';
import swal from 'sweetalert2';


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  announcement = {} as Announcement
  announcements: Announcement[] = []
  selectedFile: File | null = null
  term = ''
  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1

  baseUrl = environment.apiUrl

  sortableColumns = [
    { columnName: 'tittle', displayText: 'Tittle' },
    { columnName: 'filePath', displayText: 'Image' },
  ];

  constructor(
    private announcementService: AnnoucementService,
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
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
    }
    else {
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
}
