import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { WorkerShortage } from '../_interface/workerShortage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerShortageService {

  baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  addWorkerShortage(workerShortage:WorkerShortage):Observable<WorkerShortage>{
    return this.http.post<WorkerShortage>(this.baseUrl + '/workershortages/AddWorkerShortage', workerShortage)
  }

  updateWorkerShortage(workerShortage:WorkerShortage):Observable<WorkerShortage>{
    return this.http.put<WorkerShortage>(this.baseUrl + '/workershortages/UpdateWorkerShortage', workerShortage)
  }

  getWorkerShortage():Observable<WorkerShortage[]>{
    return this.http.get<WorkerShortage[]>(this.baseUrl + '/workerShortages/GetWorkerShortage')
  }

}
