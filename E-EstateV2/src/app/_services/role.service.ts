import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Role } from '../_interface/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addRole(roleName: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    const body = JSON.stringify(roleName);
    return this.http.post(this.baseUrl + '/roles/AddRole', body, { headers })
  }

  getRole(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl + '/roles/GetRoles')
  }


}
