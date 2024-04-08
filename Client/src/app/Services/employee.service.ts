import { Injectable } from '@angular/core';
import { Employee } from '../Models/employeeModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private _http: HttpClient) { }
 
  getEmployeesList(): Observable<Employee[]> {
    return this._http.get<Employee[]>('https://localhost:7149/api/Employees')
  }
  getEmployeeById(id: number): Observable<Employee> {
    return this._http.get<Employee>(`https://localhost:7149/api/Employees/${id}`)
  }
  addEmployee(employee: Employee) {
    return this._http.post('https://localhost:7149/api/Employees', employee) 
  }
  updateEmployee(employee: Employee,id: number) 
  {
    return this._http.put(`https://localhost:7149/api/Employees/${id}`, employee)
  }
  deleteEmployee(id:number) 
  {
    return this._http.delete(`https://localhost:7149/api/Employees/${id}`)
  }
}
