import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Buyer } from '../_interface/buyer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addBuyer(buyer: Buyer): Observable<Buyer> {
    return this.http.post<Buyer>(this.baseUrl + '/buyers/AddBuyer', buyer)
  }

  getBuyer(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(this.baseUrl + '/buyers/GetBuyers')
  }

  updateBuyer(buyer: Buyer): Observable<Buyer> {
    return this.http.put<Buyer>(this.baseUrl + '/buyers/UpdateBuyer', buyer)
  }

}
