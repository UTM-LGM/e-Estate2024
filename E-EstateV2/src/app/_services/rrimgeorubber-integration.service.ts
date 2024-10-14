import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, RRIMGeoRubber } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RrimgeorubberIntegrationService {
  baseUrl = RRIMGeoRubber.apiUrl

  constructor(private http:HttpClient) { }

  getGeoRubber(licenseNo:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/RRIMestet/GetGeoJson/'+ licenseNo)
  }
}
