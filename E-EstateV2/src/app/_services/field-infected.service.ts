import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { FieldInfected } from '../_interface/fieldInfected';
import { Observable } from 'rxjs';
import { Field } from '../_interface/field';

@Injectable({
  providedIn: 'root'
})
export class FieldInfectedService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addFieldInfected(fieldInfected:FieldInfected):Observable<FieldInfected>{
    return this.http.post<FieldInfected>(this.baseUrl + '/fieldInfecteds/AddFieldInfected', fieldInfected)
  }

  getFieldInfected():Observable<FieldInfected[]>{
    return this.http.get<FieldInfected[]>(this.baseUrl + '/fieldInfecteds/getFieldInfected')
  }

  updateFieldInfected(fieldInfected:FieldInfected):Observable<FieldInfected>{
    return this.http.put<FieldInfected>(this.baseUrl + '/fieldInfecteds/UpdateFieldInfected', fieldInfected)
  }

  getFieldInfectedByEstateId(id:number):Observable<FieldInfected[]>{
    return this.http.get<FieldInfected[]>(this.baseUrl + '/fieldInfecteds/GetFieldInfectedByEstateId/' + id)
  }

  updateFieldInfectedRemark(fieldInfected:FieldInfected):Observable<FieldInfected>{
    return this.http.put<FieldInfected>(this.baseUrl + '/fieldInfecteds/UpdateFieldInfectedRemark', fieldInfected)
  }

  getFieldInfectedById(id:number):Observable<FieldInfected[]>{
    return this.http.get<FieldInfected[]>(this.baseUrl + '/fieldInfecteds/GetFieldInfectedById/' + id)
  }
  
}
