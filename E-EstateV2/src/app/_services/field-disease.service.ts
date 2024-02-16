import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FieldDisease } from '../_interface/fieldDisease';

@Injectable({
  providedIn: 'root'
})
export class FieldDiseaseService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getFieldDisease():Observable<FieldDisease[]>{
    return this.http.get<FieldDisease[]>(this.baseUrl + '/fieldDiseases/GetFieldDisease')
  }

  addFieldDisease(fieldDisease:FieldDisease):Observable<FieldDisease>{
    return this.http.post<FieldDisease>(this.baseUrl + '/fieldDiseases/AddFieldDisease', fieldDisease)
  }

  updateFieldDisease(fieldDisease:FieldDisease):Observable<FieldDisease>{
    return this.http.put<FieldDisease>(this.baseUrl + '/fieldDiseases/UpdateFieldDisease', fieldDisease)
  }
}
