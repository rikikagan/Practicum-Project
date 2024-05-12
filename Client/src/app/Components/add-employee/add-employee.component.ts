import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Inject } from '@angular/core';
import { EmployeeService } from '../../Services/employee.service';
import { RoleService } from '../../Services/role.service';
import { EmployeeRoleService } from '../../Services/employee-role.service';
import { Role } from '../../Models/RoleModel';
import { Employee } from '../../Models/employeeModel';
import { EmployeeRoles } from '../../Models/EmployeeRolesModel';
import { validateBirthDate, validateUniqueRoles, validateRoleStartDate } from '../../Validation/Validation';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatIconModule, MatSelectModule, CommonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatButtonModule],
  providers: [MatNativeDateModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
  public addEmployeeForm!: FormGroup;
  public roleList: Role[] = [];
  public newEmployeeId!: number;
  public responseData!: any;
  public minStartDate!: Date;
  public roleExists: EmployeeRoles[] = [];
  constructor(private employeeService: EmployeeService,
    private fb: FormBuilder, private roleService: RoleService, private employeeRoleService: EmployeeRoleService
    , @Inject(MAT_DIALOG_DATA) public data: any
    , private dialogRef: MatDialogRef<AddEmployeeComponent>, private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    // הבאת רשימת תפקידים מהשרת
    this.roleService.getRolesList().subscribe({
      next: (res) => {
        this.roleList = res;
        this.initializeForm();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  // פונקציה לאתחול הטופס
  initializeForm(): void {
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    this.addEmployeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      tz: ['', [Validators.required,Validators.pattern(/^\d+$/), Validators.minLength(9), Validators.maxLength(9)]],
      startDate: [today, [Validators.required]],
      dateOfBirth: [minBirthDate, [Validators.required, validateBirthDate]],
      roles: this.fb.array([], [validateUniqueRoles()]), // Initialize roles as empty array
      gender: [0, [Validators.required, Validators.pattern(/^(1|2)$/)]]
    });
  }
  // פונקציה לקבלת רשימת התפקידים
  get roles(): FormArray {
    return this.addEmployeeForm.get('roles') as FormArray;
  }
  // פונקציה להוספת תפקיד חדש
  addRole(): void {
    this.minStartDate = this.addEmployeeForm?.value.startDate;
    const roleGroup = this.fb.group({
      roleId: ['', [Validators.required]],
      isManagement: [false],
      startDate: [this.minStartDate, [Validators.required, validateRoleStartDate]]
    });
    this.roleExists = this.addEmployeeForm?.value.roles;
    this.roles.push(roleGroup);
  }
  // פונקציה לבדיקת בחירת התפקיד
  isRoleSelected(roleId: number): boolean {
    return this.roleExists.some(role => role.roleId === roleId);
  }
  // פונקציה להסרת תפקיד מהרשימה
  removeRole(index: number): void {
    this.roles.removeAt(index);
    this.roleExists = this.addEmployeeForm?.value.roles;
  }
  // הצגת הודעת הצלחה לאחר עדכון העובד
  showSuccessSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // בדיקה האם קיימים תפקידים כפולים
  hasDuplicateRoles(): boolean {
    const selectedRolesIds = this.addEmployeeForm.value.roles.map((role: any) => role.roleId);
    const uniqueRoleIds = new Set(selectedRolesIds);
    return selectedRolesIds.length !== uniqueRoleIds.size;
  }
  hasRoleStartDateBeforeHireDate(): boolean {
    const roles = this.addEmployeeForm.value.roles;
    const hireDate = new Date(this.addEmployeeForm.value.startDate);
    for (const role of roles) {
      const roleStartDate = new Date(role.startDate);
      if (roleStartDate < hireDate) {
        return true;
      }
    } 
    return false;
  }
  // פונקציה להוספת עובד חדש
 async addNewEmployee() {
    if (this.addEmployeeForm.valid&&!this.hasRoleStartDateBeforeHireDate()) {
      const employeeData = this.addEmployeeForm.value;
      let newEmployee: Employee = {
        id: 0,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        tz: employeeData.tz,
        startDate: employeeData.startDate,
        dateOfBirth: employeeData.dateOfBirth,
        gender: parseInt(employeeData.gender)
      };
      // לולאה להוספת תפקידים לעובד
     await this.employeeService.addEmployee(newEmployee).subscribe({
        next: (res) => {
          this.newEmployeeId = newEmployee.id;
          this.responseData = res;
          this.newEmployeeId = this.responseData.id;
          if(this.roles.length==0)
            {
              this.showSuccessSnackBar('העובד נוסף בהצלחה', 'סגור');
              this.dialogRef.close();
            }
          employeeData.roles.forEach((role: any, index: number) => {
            let newEmployeeRole: EmployeeRoles = {
              id: 0,
              roleId: role.roleId,
              startDate: role.startDate,
              isManagement: role.isManagement,
              employeeId: this.newEmployeeId,
            };
            // הוספת התפקיד לשרת
            this.employeeRoleService.addEmployeeRole(newEmployeeRole).subscribe({
              next: (res) => {
                this.responseData = res;
                newEmployeeRole.id = this.responseData.id;  
                this.showSuccessSnackBar('העובד נוסף בהצלחה', 'סגור');
                this.dialogRef.close();  
              },
              error: (err) => {
                console.error('Error adding employee:', err);
              }
            });
          })
        },
        error: (err) => {
          console.error('Error adding employee:', err);
        }
      });

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
      else {
        this.showSuccessSnackBar('נא מלא את כל השדות', 'סגור');
        return;
      }
    }
  
  }
}
