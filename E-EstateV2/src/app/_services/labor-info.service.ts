import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { LaborInfo } from '../_interface/laborInfo';
import { Observable } from 'rxjs';
import { LaborByCategory } from '../_interface/laborCategory';

@Injectable({
  providedIn: 'root'
})
export class LaborInfoService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addLabor(labor: LaborInfo): Observable<LaborInfo> {
    return this.http.post<LaborInfo>(this.baseUrl + '/LaborInformations/AddLaborInfo', labor)
  }

  addLaborCategory(labor:any[]):Observable<LaborByCategory[]>{
    return this.http.post<LaborByCategory[]>(this.baseUrl + '/LaborInformations/AddLaborByCategory', labor)
  }
  
  getLabor(): Observable<LaborInfo[]> {
    return this.http.get<LaborInfo[]>(this.baseUrl + '/LaborInformations/GetLabors')
  }

  getLaborCategories():Observable<LaborByCategory[]>{
    return this.http.get<LaborByCategory[]>(this.baseUrl + '/LaborInformations/GetLaborCategory')
  }

  getLaborCategoriesByLaborInfoId(id:number):Observable<LaborByCategory[]>{
    return this.http.get<LaborByCategory[]>(this.baseUrl + '/LaborInformations/GetLaborCategoryByLaborInfoId/'+ id)
  }

  updateLaborInfo(labor: LaborInfo): Observable<LaborInfo> {
    return this.http.put<LaborInfo>(this.baseUrl + '/LaborInformations/UpdateLaborInfo', labor)
  }

  updateLaborCategory(labor:LaborByCategory[]):Observable<LaborByCategory[]>{
    return this.http.put<LaborByCategory[]>(this.baseUrl + '/LaborInformations/UpdateLaborCategory', labor)
  }

  deleteLabor(laborInfoId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/LaborInformations/DeleteLabor/' + laborInfoId)
  }                       
  
  addLaborWithCategories(data :{laborInfo:LaborInfo, laborCategories: LaborByCategory[]}){
    return this.http.post<any>(this.baseUrl + '/LaborInformations/AddLaborWithCategories', data)
  }
}
