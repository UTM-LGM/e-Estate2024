import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { FieldInfoYearly } from '../_interface/fieldInfoYearly';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldInfoYearlyService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addExtraFieldInfo(fieldInfo: FieldInfoYearly[]): Observable<FieldInfoYearly[]> {
    return this.http.post<FieldInfoYearly[]>(this.baseUrl + '/fieldInfoYearly/AddFieldInfoYearly', fieldInfo)
  }

  getExtraFieldInfo(year: number): Observable<FieldInfoYearly[]> {
    return this.http.get<FieldInfoYearly[]>(this.baseUrl + '/fieldInfoYearly/GetFieldInfoYearly/' + year)
  }
}
