import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { OtherCrop } from '../_interface/otherCrop';

@Injectable({
  providedIn: 'root'
})
export class OtherCropService {

  baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getOtherCrop():Observable<OtherCrop[]>{
    return this.http.get<OtherCrop[]>(this.baseUrl + '/otherCrops/GetOtherCrop')
  }

  addOtherCrop(otherCrop:OtherCrop):Observable<OtherCrop>{
    return this.http.post<OtherCrop>(this.baseUrl + '/otherCrops/AddOtherCrop', otherCrop)
  }

  updateOtherCrop(otherCrop:OtherCrop):Observable<OtherCrop>{
    return this.http.put<OtherCrop>(this.baseUrl + '/otherCrops/UpdateOtherCrop', otherCrop)
  }

}
