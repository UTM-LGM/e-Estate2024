import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CompanyDetail } from '../_interface/company-detail';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetailService {

  baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getCompanyDetailByCompanyId(companyId:number):Observable<CompanyDetail>{
    return this.http.get<CompanyDetail>(this.baseUrl + '/companyDetails/GetCompanyDetailByCompanyId/'+ companyId)
  }

  addCompanyDetail(company:CompanyDetail):Observable<CompanyDetail>{
    return this.http.post<CompanyDetail>(this.baseUrl + '/companyDetails/AddCompanyDetail', company)
  }

  updateCompanyDetail(company:CompanyDetail):Observable<CompanyDetail>{
    return this.http.put<CompanyDetail>(this.baseUrl + '/companyDetails/UpdateCompanyDetail', company)
  }
}
