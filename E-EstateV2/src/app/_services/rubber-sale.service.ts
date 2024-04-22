import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { RubberSale } from '../_interface/rubberSale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RubberSaleService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addSale(sales: RubberSale): Observable<RubberSale> {
    return this.http.post<RubberSale>(this.baseUrl + '/rubbersales/AddSales', sales)
  }

  getSale(): Observable<RubberSale[]> {
    return this.http.get<RubberSale[]>(this.baseUrl + '/rubbersales/GetRubberSales')
  }

  updateSale(sale: RubberSale): Observable<RubberSale> {
    return this.http.put<RubberSale>(this.baseUrl + '/rubbersales/UpdateRubberSales', sale)
  }

  getRubberSaleById(id:number):Observable<RubberSale>{
    return this.http.get<RubberSale>(this.baseUrl + '/rubbersales/GetRubberSaleById/'+ id)
  }

}
