import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Seller } from '../_interface/seller';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addSeller(seller: Seller): Observable<Seller> {
    return this.http.post<Seller>(this.baseUrl + '/sellers/AddSeller', seller)
  }

  getSeller(): Observable<Seller[]> {
    return this.http.get<Seller[]>(this.baseUrl + '/sellers/GetSellers')
  }

  updateSeller(seller: Seller): Observable<Seller> {
    return this.http.put<Seller>(this.baseUrl + '/sellers/UpdateSeller', seller)
  }
}
