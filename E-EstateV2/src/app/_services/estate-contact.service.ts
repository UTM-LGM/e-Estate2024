import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { EstateContact } from '../_interface/estate-contact';

@Injectable({
  providedIn: 'root'
})
export class EstateContactService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getCompanyContact(): Observable<EstateContact[]> {
    return this.http.get<EstateContact[]>(this.baseUrl + '/EstateContacts/GetEstateContact')
  }

  addEstateContact(estateContact: any): Observable<EstateContact> {
    return this.http.post<EstateContact>(this.baseUrl + '/EstateContacts/AddEstateContact', estateContact)
  }

  updateEstateContact(estateContact: EstateContact): Observable<EstateContact> {
    return this.http.put<EstateContact>(this.baseUrl + '/EstateContacts/UpdateEstateContact', estateContact)
  }
}
