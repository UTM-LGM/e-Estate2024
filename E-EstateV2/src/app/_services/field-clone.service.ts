import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FieldClone } from '../_interface/fieldClone';

@Injectable({
  providedIn: 'root',
})
export class FieldCloneService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addFieldClone(clone: FieldClone[]): Observable<FieldClone[]> {
    return this.http.post<FieldClone[]>(this.baseUrl + '/fieldclones/AddClone', clone)
  }

  updateFieldClone(fieldClone: any): Observable<FieldClone> {
    return this.http.put<FieldClone>(this.baseUrl + '/fieldclones/UpdateFieldCloneStatus', fieldClone)
  }
}
