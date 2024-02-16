import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { TappingSystem } from '../_interface/tappingSystem';

@Injectable({
  providedIn: 'root'
})
export class TappingSystemService {

  baseUrl = environment.apiUrl
  
  constructor(private http: HttpClient) { }

  getTappingSystem():Observable<TappingSystem[]>{
    return this.http.get<TappingSystem[]>(this.baseUrl + '/tappingSystems/GetTappingSystem')
  }

  addTappingSystem(tappingSystem:TappingSystem):Observable<TappingSystem>{
    return this.http.post<TappingSystem>(this.baseUrl + '/tappingSystems/AddTappingSystem', tappingSystem)
  }

  updateTappingSystem(tappingSystem:TappingSystem):Observable<TappingSystem>{
    return this.http.put<TappingSystem>(this.baseUrl + '/tappingSystems/UpdateTappingSystem', tappingSystem)
  }
}
