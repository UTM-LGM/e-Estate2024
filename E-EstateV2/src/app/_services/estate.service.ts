import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Estate } from '../_interface/estate';

@Injectable({
  providedIn: 'root',
})
export class EstateService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getEstate(): Observable<Estate[]> {
    return this.http.get<Estate[]>(this.baseUrl + '/estates/GetEstates')
  }

  getOneEstate(id: number): Observable<Estate> {
    return this.http.get<Estate>(this.baseUrl + '/estates/GetOneEstate/' + id)
  }

  addEstate(estate: Estate): Observable<Estate> {
    return this.http.post<Estate>(this.baseUrl + '/estates/AddEstate', estate)
  }

  updateEstate(estate: Estate): Observable<Estate> {
    return this.http.put<Estate>(this.baseUrl + '/estates/UpdateEstate', estate)
  }

  checkEstateName(estate: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/estates/CheckEstateName/' + estate)
  }
}
