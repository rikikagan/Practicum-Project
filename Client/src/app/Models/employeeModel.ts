import { EmployeeRoles } from "./EmployeeRolesModel";


export enum Gender {
    Male = 1,
    Female = 2
}
export class Employee {
    id!: number;
    firstName!: string;
    lastName!: string;
    tz!: string;
    startDate!: Date;
    dateOfBirth!: Date;
    gender!: Gender;
}