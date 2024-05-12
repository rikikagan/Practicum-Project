import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'; // הוספת Validators
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms'; // הוספת ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../Services/employee.service';
import { EmployeeRoleService } from '../../Services/employee-role.service';
import { Employee } from '../../Models/employeeModel';
import { RoleService } from '../../Services/role.service';
import { Role } from '../../Models/RoleModel';
import { EmployeeRoles } from '../../Models/EmployeeRolesModel';
import { validateBirthDate, validateUniqueRoles, validateRoleStartDate } from '../../Validation/Validation';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatNativeDateModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatCheckboxModule,
    MatDialogModule, MatIconModule
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  public editEmployeeForm!: FormGroup;
  public employeeId!: number;
  public employee!: any;
  public employeeRoles: EmployeeRoles[] = [];
  public minStartDate!: Date;
  public roleList: Role[] = [];
  public roleExists: EmployeeRoles[] = [];
  
  constructor(
    private roleService: RoleService,private employeeService: EmployeeService,
    private fb: FormBuilder,private employeeRoleService: EmployeeRoleService,@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditEmployeeComponent>,private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    // טעינת רשימת התפקידים בהתחלת הרכיב
    this.roleService.getRolesList().subscribe({
      next: (res) => {
        this.roleList = res;
        this.employeeId = this.data.id;
        // קבלת פרטי העובד המתאימים לפי המזהה שלו
        this.employeeService.getEmployeeById(this.employeeId).subscribe({
          next: (e: any) => {
            this.employee = e;
            // איתחול הטופס עם פרטי העובד
            this.initializeForm();
          },
          error: (error) => {
            console.error('Error reading employee data:', error);
          }
        });
      },
      error: (err) => {
        console.log('getRoles', err);
      }
    });
  }
  // בדיקה האם תפקיד מסוים נבחר על ידי המשתמש
  isRoleSelected(roleId: number): boolean {
    return this.roleExists.some(role => role.roleId === roleId);
  }
  // איתחול טופס עריכת העובד
  initializeForm(): void {
    this.editEmployeeForm = this.fb.group({
      firstName: [this.employee?.firstName, [Validators.required]],
      lastName: [this.employee?.lastName, [Validators.required]],
      tz: [this.employee?.tz, [Validators.required, Validators.minLength(9), Validators.maxLength(9),Validators.pattern('^[0-9]*$')]],
      startDate: [this.employee?.startDate, [Validators.required]],
      dateOfBirth: [this.employee?.dateOfBirth, [Validators.required, validateBirthDate]],
      roles: this.fb.array([], [validateUniqueRoles()]),
      gender: [this.employee?.gender, [Validators.required, Validators.pattern(/^(1|2)$/)]]
    });
    // אם קיימים תפקידים מוגדרים עבור העובד, איתחול טופס תפקידים
    if (this.employee?.roles && this.employee.roles.length > 0) {
      this.employeeRoles = this.employee.roles;
      this.employee.roles.forEach((role: any) => {
        const roleGroup = this.initializeRoleForm(role);
        (this.editEmployeeForm.get('roles') as FormArray).push(roleGroup);
      });
    }
  }
  // איתחול טופס תפקיד
  initializeRoleForm(role?: EmployeeRoles): FormGroup {
    this.roleExists = this.editEmployeeForm?.value.roles;
    return this.fb.group({
      id: [role?.id || 0],
      roleId: [role?.roleId, [Validators.required]],
      isManagement: [role?.isManagement || false],
      startDate: [role?.startDate || new Date(), [Validators.required]]
    });
    this.roleExists = this.editEmployeeForm?.value.roles;
  }
  // קבלת המערך של התפקידים מהטופס
  get roles(): FormArray {
    return this.editEmployeeForm.get('roles') as FormArray;
  }
  // הוספת תפקיד חדש לעובד
  addRole(): void {
    this.minStartDate = this.editEmployeeForm?.value.startDate;
    const roleGroup = this.fb.group({
      roleId: ['', [Validators.required]],
      isManagement: [false],
      startDate: [this.minStartDate, [Validators.required, validateRoleStartDate]]
    });
    this.roleExists = this.editEmployeeForm?.value.roles;
    this.roles.push(roleGroup);
  }
  // הסרת תפקיד מהעובד
  removeRole(index: number): void {
    if (this.employeeRoles[index] === undefined) {
      this.roles.removeAt(index);
      this.employeeRoles = this.editEmployeeForm?.value.roles;
    }
    else {
      this.employeeRoleService.deleteEmployeeRoles(this.employeeRoles[index].id).subscribe({
        next: (res) => {
          this.roles.removeAt(index);
          this.employeeRoles = this.editEmployeeForm?.value.roles;
          
        },
        error: (err) => {
          console.log('removeRole', err);
        }
      });
    }
  }
  // הצגת הודעת הצלחה לאחר עדכון העובד
  showSuccessSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 3000, // זמן הצגת ההודעה במילישניות
      horizontalPosition: 'center', // מיקום אופקי
      verticalPosition: 'top', // מיקום אנכי
    });
  }
  // בדיקה האם קיימים תפקידים כפולים
  hasDuplicateRoles(): boolean {
    const selectedRolesIds = this.editEmployeeForm.value.roles.map((role: any) => role.roleId);
    const uniqueRoleIds = new Set(selectedRolesIds);
    return selectedRolesIds.length !== uniqueRoleIds.size;
  }
  hasRoleStartDateBeforeHireDate(): boolean {
    const roles = this.editEmployeeForm.value.roles;
    const hireDate = new Date(this.editEmployeeForm.value.startDate);
    for (const role of roles) {
      const roleStartDate = new Date(role.startDate);
      if (roleStartDate < hireDate) {
        return true;
      }
    } 
    return false;
  }
  // עדכון פרטי העובד
  update(): void {
    if (this.editEmployeeForm.valid&&!this.hasRoleStartDateBeforeHireDate()) {
      const employeeData = this.editEmployeeForm.value;
      const updatedEmployee: Employee = {
        id: this.employeeId,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        tz: employeeData.tz,
        startDate: employeeData.startDate,
        dateOfBirth: employeeData.dateOfBirth,
        gender: parseInt(employeeData.gender)
      };
      this.employeeService.updateEmployee(updatedEmployee, this.employeeId).subscribe({
        next: (res) => {
          employeeData.roles.forEach((role: any) => {
            let updatedEmployeeRole: EmployeeRoles = {
              id: role.id,
              roleId: role.roleId,
              startDate: role.startDate,
              isManagement: role.isManagement,
              employeeId: this.employeeId
            };
            if (Array.isArray(employeeData.roles)) {
              const existingRole = this.employeeRoles.find(r => r.id === role.id);
              if (existingRole) {
                this.employeeRoleService.updateEmployeeRole(updatedEmployeeRole, existingRole.id).subscribe({
                  next: (res) => {
                    console.log('Existing role updated successfully:', res);
                  },
                  error: (err) => {
                    console.error('Error updating existing employee role:', err);
                  }
                });
              }
              else {
                updatedEmployeeRole.id = 0
                this.employeeRoleService.addEmployeeRole(updatedEmployeeRole).subscribe({
                  next: (res) => {
                    console.log('New role added successfully:', res);
                  },
                  error: (err) => {
                    console.error('Error adding new employee role:', err);
                  }
                });
              }
            }
          })
        },
        error: (err) => {
          console.error('Error updating employee:', err);
        }
      });
      this.showSuccessSnackBar('העובד עודכן בהצלחה', 'סגור');
      this.dialogRef.close();
    } else {
      if (this.hasDuplicateRoles()) {
        // התראה אם קיימים תפקידים כפולים
        this.showSuccessSnackBar('ישנם תפקידים כפולים, אנא בדוק שוב את התפקידים שלך', 'סגור');
        return;
      }
      if(this.hasRoleStartDateBeforeHireDate())
        {
          this.showSuccessSnackBar('תאריך תחילת התפקיד מוקדם מתאריך תחילת העובד', 'סגור');
          return;
      }
      else{
      this.showSuccessSnackBar('מלא את כל השדות', 'סגור');
      return;
      }
    }
  }
}
