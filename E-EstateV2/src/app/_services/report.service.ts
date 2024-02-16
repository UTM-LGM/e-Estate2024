import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getEstateProductivityByField(year: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/ProductionYearlyByField/' + year)
  }

  getCurrentCropProduction(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/CurrentProductions')
  }

  getProductionYearly(year: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/ProductionYearly/' + year)
  }

  getCurrentLocalWorker(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/CurrentLocalLabors')
  }

  getCurrentForeignWorker(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/CurrentForeignLabors')
  }

  getProductivityByClone(year: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/ProductionYearlyByClone/' + year)
  }

}
