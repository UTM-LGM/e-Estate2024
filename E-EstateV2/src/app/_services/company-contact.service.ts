import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { CompanyContact } from '../_interface/company-contact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyContactService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getCompanyContact(): Observable<CompanyContact[]> {
    return this.http.get<CompanyContact[]>(this.baseUrl + '/CompanyContacts/GetCompanyContact')
  }

  addCompanyContact(companyContact: any): Observable<CompanyContact> {
    return this.http.post<CompanyContact>(this.baseUrl + '/CompanyContacts/AddCompanyContact', companyContact)
  }

  updateCompanyContact(companyContact: CompanyContact): Observable<CompanyContact> {
    return this.http.put<CompanyContact>(this.baseUrl + '/CompanyContacts/UpdateCompanyContact', companyContact)
  }
}
