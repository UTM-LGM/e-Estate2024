import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CostCategory } from '../_interface/costCategory';

@Injectable({
  providedIn: 'root',
})
export class CostCategoryService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addCostCategory(category: CostCategory): Observable<CostCategory> {
    return this.http.post<CostCategory>(this.baseUrl + '/costcategories/AddCostCategory', category)
  }

  getCostCategory(): Observable<CostCategory[]> {
    return this.http.get<CostCategory[]>(this.baseUrl + '/costcategories/GetCostCategories')
  }

  updateCategory(category: CostCategory): Observable<CostCategory> {
    return this.http.put<CostCategory>(this.baseUrl + '/costcategories/UpdateCostCategory', category)
  }
}
