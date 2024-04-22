import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FieldProduction } from '../_interface/fieldProduction';

@Injectable({
  providedIn: 'root',
})
export class FieldProductionService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addProduction(production: FieldProduction[]): Observable<FieldProduction[]> {
    return this.http.post<FieldProduction[]>(this.baseUrl + '/fieldproductions/AddFieldProduction', production)
  }

  getProduction(): Observable<FieldProduction[]> {
    return this.http.get<FieldProduction[]>(this.baseUrl + '/fieldproductions/GetFieldProductions')
  }

  updateProduction(production: FieldProduction): Observable<FieldProduction> {
    return this.http.put<FieldProduction>(this.baseUrl + '/fieldproductions/UpdateProduction', production)
  }

  updateProductionDraft(production:FieldProduction[]):Observable<FieldProduction>{
    return this.http.put<FieldProduction>(this.baseUrl + '/fieldproductions/UpdateProductionDraft', production)
  }

}
