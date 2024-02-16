import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Town } from '../_interface/town';

@Injectable({
  providedIn: 'root',
})
export class TownService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getTown(): Observable<Town[]> {
    return this.http.get<Town[]>(this.baseUrl + '/towns/GetTowns')
  }

  addTown(town: Town): Observable<Town> {
    return this.http.post<Town>(this.baseUrl + '/towns/AddTown', town)
  }

  updateTown(town: Town): Observable<Town> {
    return this.http.put<Town>(this.baseUrl + '/towns/UpdateTown', town)
  }

}
