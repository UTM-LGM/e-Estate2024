import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FieldGrant } from '../_interface/fieldGrant';

@Injectable({
  providedIn: 'root'
})
export class FieldGrantService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addFieldGrantArray(grant:FieldGrant[]):Observable<FieldGrant[]>{
    return this.http.post<FieldGrant[]>(this.baseUrl + '/fieldGrants/AddFieldGrant', grant)
  }

  addFieldGrant(grant:FieldGrant):Observable<FieldGrant>{
    return this.http.post<FieldGrant>(this.baseUrl + '/fieldGrants/AddGrant', grant)
  }

  updateFieldGrant(grant:any):Observable<FieldGrant>{
    return this.http.put<FieldGrant>(this.baseUrl + '/fieldGrants/UpdateFieldGrant', grant)
  }

  getFieldGrantByFieldId(fieldId:number):Observable<FieldGrant[]>{
    return this.http.get<FieldGrant[]>(this.baseUrl + '/fieldGrants/GetFieldGrantByFieldId/'+ fieldId)
  }

  deleteGrant(grantId:number):Observable<FieldGrant>{
    return this.http.delete<FieldGrant>(this.baseUrl + '/fieldGrants/DeleteGrant/' + grantId)
  }
  
}
