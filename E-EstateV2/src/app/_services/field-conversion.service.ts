import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { FieldConversion } from '../_interface/fieldConversion';

@Injectable({
  providedIn: 'root'
})
export class FieldConversionService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addConversion(field: FieldConversion): Observable<FieldConversion> {
    return this.http.post<FieldConversion>(this.baseUrl + '/fieldConversions/AddConversion', field)
  }

  updateConversion(field: FieldConversion): Observable<FieldConversion> {
    return this.http.put<FieldConversion>(this.baseUrl + '/fieldConversions/UpdateConversion', field)
  }

  getConversion(): Observable<FieldConversion[]> {
    return this.http.get<FieldConversion[]>(this.baseUrl + '/fieldConversions/GetConversions')
  }

}
