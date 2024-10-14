import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { LaborInformation } from '../_interface/laborInformation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaborTypeService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getType(): Observable<LaborInformation[]> {
    return this.http.get<LaborInformation[]>(this.baseUrl + '/LocalLaborTypes/GetLaborTypes')
  }

  addType(type: LaborInformation): Observable<LaborInformation> {
    return this.http.post<LaborInformation>(this.baseUrl + '/LocalLaborTypes/AddLaborType', type)
  }

  updateType(type: LaborInformation): Observable<LaborInformation> {
    return this.http.put<LaborInformation>(this.baseUrl + '/LocalLaborTypes/UpdateLaborType', type)
  }
}
