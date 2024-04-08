import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../Models/RoleModel';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private _http: HttpClient) { }
 
  getRolesList(): Observable<Role[]> {
    return this._http.get<Role[]>('https://localhost:7149/api/Role')
  }
  getRoleById(id: number): Observable<Role> {
    return this._http.get<Role>(`https://localhost:7149/api/Role/${id}`)
  }
  addRole(role: Role) {
    return this._http.post('https://localhost:7149/api/Role', role)   
  }
  updateRole(role: Role,id: number) 
  {
    return this._http.put(`https://localhost:7149/api/Role/${id}`, role)
  }
  deleteRole(id:number) 
  {
    return this._http.delete(`https://localhost:7149/api/Role/${id}`)
  }
}
