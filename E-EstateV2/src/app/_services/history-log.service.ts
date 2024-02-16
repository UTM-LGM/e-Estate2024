import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HistoryLog } from '../_interface/historyLog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addHistoryLog(historyLog: HistoryLog): Observable<HistoryLog> {
    return this.http.post<HistoryLog>(this.baseUrl + '/historyLogs/AddHistoryLog', historyLog)
  }
}
