import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { MembershipType } from '../_interface/membership';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getMembership(): Observable<MembershipType[]> {
    return this.http.get<MembershipType[]>(this.baseUrl + '/memberships/GetMemberships')
  }

  addMembership(membership: MembershipType): Observable<MembershipType> {
    return this.http.post<MembershipType>(this.baseUrl + '/memberships/AddMembership', membership)
  }

  updateMembership(membership: MembershipType): Observable<MembershipType> {
    return this.http.put<MembershipType>(this.baseUrl + '/memberships/UpdateMembership', membership)
  }

}
