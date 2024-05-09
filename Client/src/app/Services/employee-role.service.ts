import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeRoles } from '../Models/EmployeeRolesModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleService {
    constructor(private _http: HttpClient) { }  
    getEmployeeRolesList(): Observable<EmployeeRoles[]> {
      return this._http.get<EmployeeRoles[]>('https://localhost:7149/api/EmployeeRole')
    }
    getEmployeeRoleById(id: number): Observable<EmployeeRoles> {
      return this._http.get<EmployeeRoles>(`https://localhost:7149/api/EmployeeRole/byId/${id}`)
    }
    getEmployeeRoleByEmployeeId(id: number): Observable<EmployeeRoles[]> {
      return this._http.get<EmployeeRoles[]>(`https://localhost:7149/api/EmployeeRole/${id}`)
    }
    addEmployeeRole(employeeRoles: EmployeeRoles) {
      return this._http.post('https://localhost:7149/api/EmployeeRole', employeeRoles)   
    }
    updateEmployeeRole(employeeRoles: EmployeeRoles,id: number) 
    {
      return this._http.put(`https://localhost:7149/api/EmployeeRole/${id}`, employeeRoles)
    }
    deleteEmployeeRoles(id:number) 
    {
      return this._http.delete(`https://localhost:7149/api/EmployeeRole/${id}`)
    }
}
