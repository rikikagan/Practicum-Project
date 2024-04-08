import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar} from '@angular/material/snack-bar';
import { RoleService } from '../../Services/role.service';
import { Role } from '../../Models/RoleModel';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatFormFieldModule,ReactiveFormsModule,MatIconModule,
    MatButtonModule,MatCardModule,MatInputModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent {
  public addRole!: FormGroup;
  constructor(private roleService: RoleService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
    ,private dialogRef: MatDialogRef<AddRoleComponent>,private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.addRole = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  //הוספת תפקיד חדש
  addNewRole() {
    if (this.addRole.valid) {
      let newRole: Role = {
        id: 0,
        roleName: this.addRole.value.roleName
      }
      this.roleService.addRole(newRole).subscribe({
        next: (res) => {
          this.openSnackBar("התפקיד נוסף בהצלחה","סגור")
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center', // מיקום אופקי
      verticalPosition: 'top', // מיקום אנכי
    });
  }
}
