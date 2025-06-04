import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { RubberSale } from '../_interface/rubberSale';
import { Observable } from 'rxjs';
import { RunGuardsAndResolvers } from '@angular/router';

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

  updateSale(sale: any): Observable<RubberSale> {
    return this.http.put<RubberSale>(this.baseUrl + '/rubbersales/UpdateRubberSales', sale)
  }

  getRubberSaleById(id:number):Observable<RubberSale>{
    return this.http.get<RubberSale>(this.baseUrl + '/rubbersales/GetRubberSaleById/'+ id)
  }

  updateWeightSlip(loc: string, rubberSale: RubberSale): Observable<RubberSale> {
    return this.http.put<RubberSale>(`${this.baseUrl}/rubberSalesIntegration/UpdateWeightSlipNo/${loc}`, rubberSale);
  }

  updateReceiptNo(loc:string, rubberSale:RubberSale):Observable<RubberSale>{
    return this.http.put<RubberSale>(`${this.baseUrl}/rubberSalesIntegration/UpdateReceiptNo/${loc}`, rubberSale)
  }

}
