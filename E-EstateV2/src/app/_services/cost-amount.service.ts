import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { CostAmount } from '../_interface/costAmount';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostAmountService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addCostAmount(amount: CostAmount[]): Observable<CostAmount[]> {
    return this.http.post<CostAmount[]>(this.baseUrl + '/costamounts/AddCostAmount', amount)
  }

  getCostAmount(): Observable<CostAmount[]> {
    return this.http.get<CostAmount[]>(this.baseUrl + '/costamounts/GetCostAmounts')
  }

  updateCostAmount(amount: CostAmount[]): Observable<CostAmount> {
    return this.http.put<CostAmount>(this.baseUrl + '/costamounts/UpdateCostAmount', amount)
  }
}
