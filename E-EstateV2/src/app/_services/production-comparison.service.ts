import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { ProductionComparison } from '../_interface/productionComparison';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionComparisonService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addProductionComparison(productComparison: ProductionComparison): Observable<ProductionComparison> {
    return this.http.post<ProductionComparison>(this.baseUrl + '/productComparisons/AddProductionComparison', productComparison)
  }
  getProductionComparison(): Observable<ProductionComparison[]> {
    return this.http.get<ProductionComparison[]>(this.baseUrl + '/productComparisons/GetProductionComparisons')
  }
}
