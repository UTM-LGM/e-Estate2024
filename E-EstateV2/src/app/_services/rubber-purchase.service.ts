import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { RubberPurchase } from '../_interface/rubberPurchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RubberPurchaseService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addPurchase(purchase: RubberPurchase): Observable<RubberPurchase> {
    return this.http.post<RubberPurchase>(this.baseUrl + '/rubberpurchases/AddPurchase', purchase)
  }

  getPurchase(): Observable<RubberPurchase[]> {
    return this.http.get<RubberPurchase[]>(this.baseUrl + '/rubberpurchases/GetRubberPurchases')
  }

  updatePurchase(purchase: RubberPurchase): Observable<RubberPurchase> {
    return this.http.put<RubberPurchase>(this.baseUrl + '/rubberpurchases/UpdateRubberPurchase', purchase)
  }
}
