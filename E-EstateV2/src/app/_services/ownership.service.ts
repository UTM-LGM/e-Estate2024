import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Ownership } from '../_interface/ownership';

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getOwnership():Observable<Ownership[]>{
    return this.http.get<Ownership[]>(this.baseUrl + '/ownerships/GetOwnership')
  }

  addOwnership(ownership:Ownership):Observable<Ownership>{
    return this.http.post<Ownership>(this.baseUrl + '/ownerships/AddOwnership', ownership)
  }

  updateOwnership(ownership:Ownership):Observable<Ownership>{
    return this.http.put<Ownership>(this.baseUrl + '/ownerships/UpdateOwnership', ownership)
  }

}
