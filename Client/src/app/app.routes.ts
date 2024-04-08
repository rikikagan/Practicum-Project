import { Routes } from '@angular/router';
import { NotFoundComponent } from './Components/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'all-employee', pathMatch: 'full' },
    { path: 'all-employee', loadComponent: () => import('./Components/all-employee/all-employee.component').then(e=>e.AllEmployeeComponent)},
    { path: 'edit-employee/:id', loadComponent: () => import('./Components/edit-employee/edit-employee.component').then(e=>e.EditEmployeeComponent)},
    { path: 'add-employee', loadComponent: () => import('./Components/add-employee/add-employee.component').then(e=>e.AddEmployeeComponent)},
    { path: 'add-role', loadComponent: () => import('./Components/add-role/add-role.component').then(e=>e.AddRoleComponent)},
    { path: '**', component: NotFoundComponent },
];
