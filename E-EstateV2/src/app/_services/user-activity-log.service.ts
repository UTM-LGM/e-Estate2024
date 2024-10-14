import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { UserActivityLog } from '../_interface/userActivityLog';

@Injectable({
  providedIn: 'root'
})
export class UserActivityLogService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  logActivity(userActivity: UserActivityLog): Observable<UserActivityLog> {
    return this.http.post<UserActivityLog>(this.baseUrl + '/useractivitylogs/AddActivityLog', userActivity)
  }

}
