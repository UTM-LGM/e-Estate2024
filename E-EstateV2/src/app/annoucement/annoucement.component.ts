import { Component, OnDestroy, OnInit } from '@angular/core';
import { Announcement } from '../_interface/annoucement';
import { AnnoucementService } from '../_services/annoucement.service';
import { environment } from 'src/environments/environments';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-annoucement',
  templateUrl: './annoucement.component.html',
  styleUrls: ['./annoucement.component.css']
})
export class AnnoucementComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = []

  baseUrl = environment.apiUrl

  constructor(
    private announcementService: AnnoucementService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    const getAnnouncement = this.announcementService.getAnnouncement()
      .subscribe(
        Response => {
          const announcement = Response
          this.announcements = announcement.filter(x => x.isActive == true)
        }
      )
      this.subscriptionService.add(getAnnouncement);
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
