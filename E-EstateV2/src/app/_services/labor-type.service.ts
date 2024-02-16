import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { LocalLaborType } from '../_interface/localLaborType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaborTypeService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getType(): Observable<LocalLaborType[]> {
    return this.http.get<LocalLaborType[]>(this.baseUrl + '/locallabortypes/GetLaborTypes')
  }

  addType(type: LocalLaborType): Observable<LocalLaborType> {
    return this.http.post<LocalLaborType>(this.baseUrl + '/locallabortypes/AddLaborType', type)
  }

  updateType(type: LocalLaborType): Observable<LocalLaborType> {
    return this.http.put<LocalLaborType>(this.baseUrl + '/locallabortypes/UpdateLaborType', type)
  }
}
