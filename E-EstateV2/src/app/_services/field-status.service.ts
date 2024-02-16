import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FieldStatus } from '../_interface/fieldStatus';

@Injectable({
  providedIn: 'root',
})
export class FieldStatusService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getFieldStatus(): Observable<FieldStatus[]> {
    return this.http.get<FieldStatus[]>(this.baseUrl + '/fieldstatuses/GetFieldStatuses')
  }

  addFieldStatus(status: FieldStatus): Observable<FieldStatus> {
    return this.http.post<FieldStatus>(this.baseUrl + '/fieldstatuses/AddFieldStatus', status)
  }

  updateFieldStatus(status: FieldStatus): Observable<FieldStatus> {
    return this.http.put<FieldStatus>(this.baseUrl + '/fieldstatuses/UpdateFieldStatus', status)
  }
}
