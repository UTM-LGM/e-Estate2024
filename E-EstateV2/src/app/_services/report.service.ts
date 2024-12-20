import { HttpClient, HttpParams } from '@angular/common/http';
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

  getCurrentCropProduction(year:string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/CurrentProductions/' + year)
  }

  getCropProductivity(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/reports/GetProductivity')
  }

  getStateFieldArea(start: string, end: string): Observable<any[]> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(this.baseUrl + '/reports/GetStateFieldArea', {params})
  }

  getFieldArea(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetFieldArea/' + year)
  }

  getCurrentTapperAndFieldWorker(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetCurrentTapperAndFieldWorker/'+ year)
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

  getAllProductivityByClone(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
      return this.http.get<any[]>(this.baseUrl + '/reports/GetAllProductivityYearlyByClone', {params} )
  }

  getLaborInformationCategory(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetLaborInformationCategory/' + year )
  }

  getAllLaborInformationCategory(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
      return this.http.get<any[]>(this.baseUrl + '/reports/GetAllLaborInformationCategory', {params} )
  }

  getTapperAndFieldWorker(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetTapperAndFieldWorker/'+ year)
  }

  getAllTapperAndFieldWorker(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
      return this.http.get<any[]>(this.baseUrl + '/reports/GetAllTapperAndFieldWorker', {params} )
  }

  getWorkerShortageEstate(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetWorkerShortageEstate/' + year)
  }

  getAllWorkerShortageEstate(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
      return this.http.get<any[]>(this.baseUrl + '/reports/GetAllWorkerShortageEstate', {params} )
  }

  getCostInformation(year: string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetCostInformation/' + year)
  }

  getAllCostInformation(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
      return this.http.get<any[]>(this.baseUrl + '/reports/GetAllCostInformation', {params} )
  }

  getAreaByClone(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetAreaByClone/' + year)
  }

  getAreaByAllClone(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(this.baseUrl + '/reports/GetAreaByAllClone', {params})
  }

  getCurrentField(year:string):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/reports/GetCurrentField/'+ year)
  }

  getAllRubberSale(start:string, end:string):Observable<any[]>{
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(this.baseUrl + '/reports/GetAllRubberSale', {params} )
  }

}
