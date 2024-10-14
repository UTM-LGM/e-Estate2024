import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CostSubcategory2 } from '../_interface/costSubcategory2';

@Injectable({
  providedIn: 'root',
})
export class CostSubcategory2Service {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addCostSubCategory(subcategory: CostSubcategory2): Observable<CostSubcategory2> {
    return this.http.post<CostSubcategory2>(this.baseUrl + '/costsubcategories2/AddSubCategory', subcategory)
  }

  getCostSubCategory(): Observable<CostSubcategory2[]> {
    return this.http.get<CostSubcategory2[]>(this.baseUrl + '/costsubcategories2/GetSubCategories')
  }

  updateCostSub2(subcategory: CostSubcategory2): Observable<CostSubcategory2> {
    return this.http.put<CostSubcategory2>(this.baseUrl + '/costsubcategories2/UpdateCategory', subcategory)
  }
}
