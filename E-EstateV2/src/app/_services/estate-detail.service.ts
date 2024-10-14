import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { EstateDetail } from '../_interface/estate-detail';

@Injectable({
  providedIn: 'root'
})
export class EstateDetailService {

  baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getEstateDetailbyEstateId(estateId:number):Observable<EstateDetail>{
    return this.http.get<EstateDetail>(this.baseUrl + '/estateDetails/GetEstateDetailbyEstateId/' + estateId)
  }

  addEstateDetail(estate:EstateDetail):Observable<EstateDetail>{
    return this.http.post<EstateDetail>(this.baseUrl + '/estateDetails/AddEstateDetail', estate)
  }

  updateEstateDetail(estate:EstateDetail):Observable<EstateDetail>{
    return this.http.put<EstateDetail>(this.baseUrl + '/estateDetails/UpdateEstateDetail', estate)
  }
  
}
