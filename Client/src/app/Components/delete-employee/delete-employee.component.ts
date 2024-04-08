import { Component, Inject } from '@angular/core';
import { EmployeeService } from '../../Services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-employee',
  standalone: true,
  imports: [MatDialogModule,MatIconModule,MatButtonModule],
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.css']
})
export class DeleteEmployeeComponent {
  constructor(
    public employeeService: EmployeeService,
    public dialogRef: MatDialogRef<DeleteEmployeeComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  deleteEmployee() {
       this.employeeService.deleteEmployee(this.data.id).subscribe({
      next: (res) => {
        this.openSnackBar('העובד נמחק בהצלחה');
        this.dialogRef.close(); // לסגור את הדיאלוג לאחר מחיקה מוצלחת
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
      }
    });
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'סגור', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
