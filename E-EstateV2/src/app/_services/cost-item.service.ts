import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Cost } from '../_interface/cost';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostItemService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addCostItem(cost: Cost): Observable<Cost> {
    return this.http.post<Cost>(this.baseUrl + '/costItems/AddCostItem', cost)
  }

  getCostItem(): Observable<Cost[]> {
    return this.http.get<Cost[]>(this.baseUrl + '/costItems/GetCostItems')
  }

  updateCostItem(cost: Cost): Observable<Cost> {
    return this.http.put<Cost>(this.baseUrl + '/costItems/UpdateCostItem', cost)
  }

}
