import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CostSubcategory1 } from '../_interface/costSubcategory1';

@Injectable({
  providedIn: 'root',
})
export class CostSubcategory1Service {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addCostSubCategory(subcategory: CostSubcategory1): Observable<CostSubcategory1> {
    return this.http.post<CostSubcategory1>(this.baseUrl + '/costsubcategories1/AddSubCatategory', subcategory)
  }

  getCostSubCategory(): Observable<CostSubcategory1[]> {
    return this.http.get<CostSubcategory1[]>(this.baseUrl + '/costsubcategories1/GetSubCategories')
  }

  updateCostSub1(subcategory: CostSubcategory1): Observable<CostSubcategory1> {
    return this.http.put<CostSubcategory1>(this.baseUrl + '/costsubcategories1/UpdateSubCategory', subcategory)
  }
}
