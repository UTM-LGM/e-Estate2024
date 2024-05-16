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

  getCropProductivity(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/GetProductivity')
  }

  getFieldArea(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetFieldArea/' + year)
  }

  getCurrentTapperAndFieldWorker():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetCurrentTapperAndFieldWorker')
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

  getProductionByClone(year: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/ProductionYearlyByClone/' + year)
  }

  getProductivityByClone(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/ProductivityYearlyByClone/' + year) 
  }

  getLaborInformationCategory():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetLaborInformationCategory' )
  }

  getTapperAndFieldWorker():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetTapperAndFieldWorker')
  }

  getWorkerShortageEstate():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetWorkerShortageEstate')
  }

  getCostInformation(year: string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetCostInformation/' + year)
  }

  getAreaByClone(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetAreaByClone/' + year)
  }

  getCurrentField(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetCurrentField/'+ year)
  }

}
