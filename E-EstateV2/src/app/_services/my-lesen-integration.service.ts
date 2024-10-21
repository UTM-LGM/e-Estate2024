import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
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

  getAllActiveEstate():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/estate/getactivepremises')
  }

  //get estate sahaje
  getLicenseNo(licenseNo:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/estate/GetDetailByLicense/' + licenseNo)
  }

  //get all license
  getAllByLicenseNo(licenseNo:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/GetDetailByAllLicense/' + licenseNo)
  }


  //get premise by estate id
  getOneEstate(id:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/GetPremiseById/' + id)
  }

  //get premise by license
  getEstateByLicense(licenseNo:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/GetPremiseByLicense/' + licenseNo)
  }

  //get by license no
  getOneEstateByLicenseNo(licenseNo:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/GetDetailByLicense/' + licenseNo)
  }

  getEstateByStateId(id:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/estate/getestatebystateid/' + id)
  }
  
}
