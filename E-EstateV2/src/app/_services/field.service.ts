import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Field } from '../_interface/field';
import { FieldClone } from '../_interface/fieldClone';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addField(field: Field): Observable<Field> {
    return this.http.post<Field>(this.baseUrl + '/fields/AddField', field)
  }

  getField(): Observable<Field[]> {
    return this.http.get<Field[]>(this.baseUrl + '/fields/GetFields')
  }

  getOneField(id: number): Observable<Field> {
    return this.http.get<Field>(this.baseUrl + '/fields/GetOneField/' + id)
  }

  updateField(field: Field): Observable<Field> {
    return this.http.put<Field>(this.baseUrl + '/fields/updatefield', field)
  }

  updateFieldInfected(field:Field):Observable<Field>{
    return this.http.put<Field>(this.baseUrl + '/fields/UpdateFieldInfected', field)
  }

  addClone(clone: FieldClone): Observable<FieldClone> {
    return this.http.post<FieldClone>(this.baseUrl + '/fields/addclone', clone)
  }

  deleteClone(cloneId: number, fieldId: number): Observable<FieldClone> {
    return this.http.delete<FieldClone>(this.baseUrl + '/fields/deleteclone/' + cloneId + '/' + fieldId)
  }

  addFieldWithDetails(field: Field, fieldClones: any[], fieldGrants: any[]): Observable<any> {
    const payload = {
      field,
      fieldClones,
      fieldGrants
    };
    return this.http.post<any>(this.baseUrl + '/fields/addFieldWithDetails', payload);
  }

  updateFieldWithDetails(field: Field, fieldClones: any[], fieldGrants: any[]): Observable<any> {
    const payload = {
      field: field,
      fieldClones: fieldClones,
      fieldGrants: fieldGrants
    };
    return this.http.post<any>(this.baseUrl + '/fields/updateFieldWithDetails', payload);
  }

}
