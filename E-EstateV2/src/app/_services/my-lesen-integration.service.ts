import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyLesenEnv, environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MyLesenIntegrationService {

  baseUrl = MyLesenEnv.apiUrl

  constructor(private http:HttpClient) { }

  getAllCompany():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/estate/GetCompanies')
  }

  getOneCompany(id:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/GetCompany/' + id)
  }

  getAllEstate():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/estate/GetPremises')
  }

  getLicenseNo(id:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/estate/GetDetailByLicense/' + id)
  }

  getOneEstate(id:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/GetPremiseById/' + id)
  }
}
