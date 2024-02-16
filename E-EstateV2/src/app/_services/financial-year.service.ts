import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FinancialYear } from '../_interface/financialYear';

@Injectable({
  providedIn: 'root',
})
export class FinancialYearService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getFinancialYear(): Observable<FinancialYear[]> {
    return this.http.get<FinancialYear[]>(this.baseUrl + '/financialyears/GetFinancialYears')
  }

  addFinancialYear(financialYear: FinancialYear): Observable<FinancialYear> {
    return this.http.post<FinancialYear>(this.baseUrl + '/financialyears/AddFinancialYear', financialYear)
  }

  updateYear(financialYear: FinancialYear): Observable<FinancialYear> {
    return this.http.put<FinancialYear>(this.baseUrl + '/financialyears/UpdateFinancialYear', financialYear)
  }

}
