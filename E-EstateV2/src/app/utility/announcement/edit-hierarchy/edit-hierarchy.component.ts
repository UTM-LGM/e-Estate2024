import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Announcement } from 'src/app/_interface/annoucement';
import { AnnoucementService } from 'src/app/_services/annoucement.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { AnnoucementComponent } from 'src/app/annoucement/annoucement.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hierarchy',
  templateUrl: './edit-hierarchy.component.html',
  styleUrls: ['./edit-hierarchy.component.css']
})
export class EditHierarchyComponent implements OnInit {

  announcement = {} as any
  announcements: Announcement[] = []


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: Announcement },
    private announcementService: AnnoucementService,
    private subscriptionService:SubscriptionService,
    public dialogRef: MatDialogRef<AnnoucementComponent>,
  ){}

  ngOnInit(){
    this.announcement = this.data.data
    this.getAnnouncement()
  }

  update(){
    if(this.announcements.some(s => s.hierarchy === this.announcement.hierarchy)) {
      swal.fire({
        text: 'Hierarchy already exists!',
        icon: 'error'
      });
    }
    else{
      this.announcementService.updateAnnouncement(this.announcement)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Announcement successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )
    }
  }

  getAnnouncement(){
    const getAnnouncement = this.announcementService.getAnnouncement()
        .subscribe(
          Response => {
            this.announcements = Response
          }
        )
      this.subscriptionService.add(getAnnouncement);
  }

  back() {
    this.dialogRef.close()
  }

}
