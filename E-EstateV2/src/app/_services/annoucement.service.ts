import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Announcement } from '../_interface/annoucement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnoucementService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addAnnouncement(announcement: Announcement, file: File): Observable<Announcement> {
    const formData = new FormData()
    formData.append('file', file, file.name)
    formData.append('tittle', announcement.tittle)
    formData.append('createdBy', announcement.createdBy)
    formData.append('isActive', announcement.isActive.toString())
    return this.http.post<Announcement>(this.baseUrl + '/announcements/AddAnnouncement', formData)
  }

  getAnnouncement(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.baseUrl + '/announcements/GetAnnouncements')
  }

  updateAnnouncement(announcement: Announcement): Observable<Announcement> {
    return this.http.put<Announcement>(this.baseUrl + '/announcements/UpdateAnnouncement', announcement)
  }

}
