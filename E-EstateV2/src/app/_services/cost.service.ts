import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Cost } from '../_interface/cost';

@Injectable({
  providedIn: 'root',
})
export class CostService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getDirectMatureCostCategory(): Observable<Cost[]> {
    return this.http.get<Cost[]>(this.baseUrl + '/costs/GetCostCategoryM')
  }

  getDirectMatureSubCategory(): Observable<Cost[]> {
    return this.http.get<Cost[]>(this.baseUrl + '/costs/GetCostSubcategoryM')
  }

  getDirectImmatureSubCategory(): Observable<Cost[]> {
    return this.http.get<Cost[]>(this.baseUrl + '/costs/GetCostSubcategoryIM')
  }

  getIndirectCost(id: number): Observable<Cost[]> {
    return this.http.get<Cost[]>(this.baseUrl + '/costs/GetCostIndirects/' + id);
  }
}
