import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// פונקציה זו בודקת אם תאריך הלידה שהוזן חוקי.
// היא מוסיפה שגיאה אם התאריך הוא תאריך שבו המשתמש צעיר מדי (פחות מ־20 שנה).
export function validateBirthDate(control: AbstractControl): ValidationErrors | null {
  const birthDate = new Date(control.value);
  const today = new Date();
  const minBirthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
  console.log('minBirthDate',minBirthDate)
  console.log('birthDate',birthDate)
  if (birthDate > minBirthDate) {
    return { invalidBirthDate: true };
  }
  return null;
}
// פונקציה זו בודקת אם תאריך תחילת תפקיד הוא חוקי לפי התאריך של תחילת העסקה.
export function validateRoleStartDate(control: AbstractControl): ValidationErrors | null {
  const roleStartDate = new Date(control.value);
  const employmentStartDate = control.root.get('startDate')?.value;
  if (roleStartDate < employmentStartDate) {
    return { invalidRoleStartDate: true };
  }
  return null;
}

// פונקציה זו בודקת אם קיימים תפקידים כפולים במערך התפקידים.
export function validateUniqueRoles(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const rolesArray = control.value;
    if (!rolesArray || !Array.isArray(rolesArray)) {
      return null; // אין צורך בבדיקה אם הערך אינו מערך
    }
    const roles = rolesArray.map((role: any) => role.roleId);
    const duplicateRoles = roles.filter((roleId: any, index: number) => roles.indexOf(roleId) !== index);
    if (duplicateRoles.length > 0) {
      return { duplicateRoles: true }; // מחזירים אובייקט המציין שקיימים תפקידים כפולים
    }
    return null; // אין תפקידים כפולים
  };
}



