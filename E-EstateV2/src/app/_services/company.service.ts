import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Company } from '../_interface/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(this.baseUrl + '/companies/GetCompanies')
  }

  getOneCompany(id: number): Observable<Company> {
    return this.http.get<Company>(this.baseUrl + '/companies/GetOneCompany/' + id)
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(this.baseUrl + '/companies/UpdateCompany', company)
  }

}
