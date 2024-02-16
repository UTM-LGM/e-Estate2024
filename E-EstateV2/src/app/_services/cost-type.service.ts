import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CostType } from '../_interface/costType';

@Injectable({
  providedIn: 'root',
})
export class CostTypeService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getCostType(): Observable<CostType[]> {
    return this.http.get<CostType[]>(this.baseUrl + '/costtypes/GetCostTypes')
  }

  addCostType(costType: CostType): Observable<CostType> {
    return this.http.post<CostType>(this.baseUrl + '/costtypes/AddCostType', costType)
  }

  updateCostType(costType: CostType): Observable<CostType> {
    return this.http.put<CostType>(this.baseUrl + '/costtypes/UpdateCostType', costType)
  }

}
