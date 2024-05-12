import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {FormBuilder, FormGroup, Validators } from '@angular/forms'; // הוספת Validators
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { EmployeeService } from '../../Services/employee.service';
import { Employee } from '../../Models/employeeModel';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { AddRoleComponent } from '../add-role/add-role.component';
import { CustomDatePipe } from '../../Pipe/custom-date.pipe';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
@Component({
  selector: 'app-all-employee',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, RouterModule, CustomDatePipe, ReactiveFormsModule, HttpClientModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule, MatDividerModule, MatFormFieldModule],
  templateUrl: './all-employee.component.html',
  styleUrl: './all-employee.component.css'
})
export class AllEmployeeComponent implements AfterViewInit {
  displayedColumns: string[] = ['editDelete', 'startDate', 'tz', 'lastName', 'firstName'];
  dataSource = new MatTableDataSource<Employee>([]); // אתחול עם מערך ריק
  public searchForm!: FormGroup; // משתנים עבור שדה החיפוש
  public isLoading: boolean = true;
  constructor(private employeeService: EmployeeService,private dialog: MatDialog, private fb: FormBuilder, private _snackBar: MatSnackBar) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.getEmployees(); // קריאה לשיטת קבלת נתוני העובדים בעת טעינת הרכיב
    // איתחול של טופס החיפוש
    this.searchForm = this.fb.group({
      searchFirstName: [''], // שדה חיפוש לפי שם פרטי
      searchLastName: [''] // שדה חיפוש לפי שם משפחה
    })
  }
  ngAfterViewInit() {
    // הגדרת הפגינטור והמיון לתוך מקור הנתונים
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  //  פונקציה זו מחזירה את ערך סרגל ההתקדמות.
  getProgressBarValue(): number {
    if (this.dataSource.data.length === 0) {
      return 0;
    }
    return (this.paginator.pageIndex + 1) / Math.ceil(this.dataSource.data.length / this.paginator.pageSize) * 100;
  }
  // שיטה לקבלת נתוני העובדים
   async getEmployees() {
    // this.isLoading = true;
    await this.employeeService.getEmployeesList()
      .subscribe({
        next: (res) => {
          this.dataSource.data = res; // עדכון מקור הנתונים
          this.isLoading = false; // הפעלת הטעינה נגמרה
        },
        error: (err) => {
          console.error('Error in hiring employees:', err);
        }
      });
  }
  // שימוש בפילטר על פי נתוני החיפוש
  applyFilter() {
    const filterValueFirstName = this.searchForm.value.searchFirstName;
    const filterValueLastName = this.searchForm.value.searchLastName;
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      return data.firstName.toLowerCase().includes(filterValueFirstName) &&
        data.lastName.toLowerCase().includes(filterValueLastName);
    };
    this.dataSource.filter = 'activate'; // הפעלת הפילטר על פי התנאים החדשים
    // בדוק אם אין תוצאות אחרי הפילטור
    if (this.dataSource.filteredData.length === 0) {
      this._snackBar.open('לא נמצאו תוצאות', 'סגור', {
        duration: 3000,
        horizontalPosition: 'center', 
        verticalPosition: 'top', 
      });
    }
  }
  // ניקוי שדה החיפוש
  clearSearchFieldFirstName(inputField: HTMLInputElement) {
    this.searchForm.get('searchFirstName')?.setValue('');
    inputField.value = '';
  }
  clearSearchFieldLastName(inputField: HTMLInputElement) {
    this.searchForm.get('searchLastName')?.setValue('');
    inputField.value = '';
  }
  // מחיקת עובד
  deleteEmployee(element: Employee) {
    this.isLoading = true; // מצב טעינה מתחיל עד שהדיאלוג נפתח
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      data: { id: element.id }, // שליחת ה-id כפרמטר ב-data
      disableClose: true,
    });
    dialogRef.afterOpened().subscribe(() => {
      this.isLoading = false; // מצב טעינה מסתיים כאשר הדיאלוג נפתח
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getEmployees(); // רענון רשימת העובדים לאחר סגירת הדיאלוג
    });
  }
  // עריכת עובד
  editEmployee(element: Employee) {
    this.isLoading = true; // מצב טעינה מתחיל עד שהדיאלוג נפתח
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      data: { id: element.id }, // שליחת ה-id כפרמטר ב-data
      disableClose: true,
    });
    dialogRef.afterOpened().subscribe(() => {
      this.isLoading = false; // מצב טעינה מסתיים כאשר הדיאלוג נפתח
    });
    dialogRef.afterClosed().subscribe(() => {
       this.getEmployees(); // רענון רשימת העובדים לאחר סגירת הדיאלוג
    }); 
  }
    // הוספת עובד
  addEmployee() {
    this.isLoading = true; // מצב טעינה מתחיל עד שהדיאלוג נפתח
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      disableClose: true,
    });
    dialogRef.afterOpened().subscribe(() => {
      this.isLoading = false; // מצב טעינה מסתיים כאשר הדיאלוג נפתח
    });
    dialogRef.afterClosed().subscribe(() => {
        this.getEmployees();
    });
  }
  // יציאת הנתונים לקובץ אקסל
  exportToExcel(): void {
    const elementData = this.dataSource.data; // נתוני הטבלה
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(elementData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'employees');
  }
  // שמירת הקובץ אקסל במחשב המשתמש
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(data);
    a.download = fileName + '.xlsx';
    a.click();
    document.body.removeChild(a);
  }
  // הוספת תפקיד
  addRole() {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getEmployees(); // רענון רשימת העובדים לאחר סגירת הדיאלוג
    });
  }
}
export interface PeriodicElement {
  firstname: string;
  lastname: string;
  tz: string;
  startDate: Date;
}


