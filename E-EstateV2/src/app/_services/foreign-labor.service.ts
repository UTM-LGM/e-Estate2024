import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ForeignLabor } from '../_interface/foreignLabor';

@Injectable({
  providedIn: 'root',
})
export class ForeignLaborService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addLabor(labor: ForeignLabor): Observable<ForeignLabor> {
    return this.http.post<ForeignLabor>(this.baseUrl + '/foreignlabors/AddLabor', labor)
  }

  getLabor(): Observable<ForeignLabor[]> {
    return this.http.get<ForeignLabor[]>(this.baseUrl + '/foreignlabors/GetLabors')
  }

  deleteLabor(id: number): Observable<ForeignLabor> {
    return this.http.delete<ForeignLabor>(this.baseUrl + '/foreignlabors/DeleteLabor/' + id)
  }

  updateLabor(labor: ForeignLabor): Observable<ForeignLabor> {
    return this.http.put<ForeignLabor>(this.baseUrl + '/foreignlabors/UpdateLabor', labor)
  }
}
