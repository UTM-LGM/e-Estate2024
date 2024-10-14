import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiseaseCategory } from '../_interface/diseaseCategory';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiseaseCategoryService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getDiseaseCategory():Observable<DiseaseCategory[]>{
    return this.http.get<DiseaseCategory[]>(this.baseUrl + '/diseaseCategories/GetDiseaseCategory')
  }
}
