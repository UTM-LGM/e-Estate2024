import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { LocalLabor } from '../_interface/localLabor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalLaborService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addLabor(labor: LocalLabor[]): Observable<LocalLabor[]> {
    return this.http.post<LocalLabor[]>(this.baseUrl + '/locallabors/AddLabor', labor)
  }

  getLabor(): Observable<LocalLabor[]> {
    return this.http.get<LocalLabor[]>(this.baseUrl + '/locallabors/GetLocalLabors')
  }

  updateLabor(labor: LocalLabor): Observable<LocalLabor> {
    return this.http.put<LocalLabor>(this.baseUrl + '/locallabors/UpdateLabor', labor)
  }

}
