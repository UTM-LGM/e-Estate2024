import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { RubberStock } from '../_interface/rubberStock';

@Injectable({
  providedIn: 'root'
})
export class RubberStockService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getRubberStock():Observable<RubberStock[]>{
    return this.http.get<RubberStock[]>(this.baseUrl + '/rubberStocks/GetRubberStocks')
  }

  addRubberStock(rubberStock:RubberStock):Observable<RubberStock>{
    return this.http.post<RubberStock>(this.baseUrl + '/rubberStocks/AddRubberStock', rubberStock)
  }

  updateRubberStock(rubberStock:RubberStock):Observable<RubberStock>{
    return this.http.put<RubberStock>(this.baseUrl + '/rubberStocks/UpdateRubberStock', rubberStock)
  }
}
