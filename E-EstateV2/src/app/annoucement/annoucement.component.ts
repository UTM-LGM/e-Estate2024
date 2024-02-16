import { Component, OnInit } from '@angular/core';
import { Announcement } from '../_interface/annoucement';
import { AnnoucementService } from '../_services/annoucement.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-annoucement',
  templateUrl: './annoucement.component.html',
  styleUrls: ['./annoucement.component.css']
})
export class AnnoucementComponent implements OnInit {
  announcements: Announcement[] = []

  baseUrl = environment.apiUrl

  constructor(
    private announcementService: AnnoucementService
  ) { }

  ngOnInit(): void {
    this.announcementService.getAnnouncement()
      .subscribe(
        Response => {
          const announcement = Response
          this.announcements = announcement.filter(x => x.isActive == true)
        }
      )
  }
}
