import { HrService } from "./hr.service";
export declare class HrController {
    private readonly service;
    constructor(service: HrService);
    createEmployee(tenantHeader?: string, dto?: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        status: string | null;
        grossSalary: number | null;
        salary: number | null;
        employmentType: import(".prisma/client").$Enums.EmploymentType | null;
        position: string | null;
        firstName: string;
        lastName: string;
        department: string | null;
        jobTitle: string | null;
        leaveBalance: number;
    }>;
    getEmployees(tenantHeader?: string): Promise<({
        payrolls: {
            id: string;
            createdAt: Date;
            tenantId: string;
            status: string | null;
            employeeId: string;
            netPay: number | null;
            deductions: number | null;
            grossPay: number | null;
            payPeriod: string | null;
            period: string | null;
            grossAmount: number | null;
            netAmount: number | null;
            taxAmount: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        status: string | null;
        grossSalary: number | null;
        salary: number | null;
        employmentType: import(".prisma/client").$Enums.EmploymentType | null;
        position: string | null;
        firstName: string;
        lastName: string;
        department: string | null;
        jobTitle: string | null;
        leaveBalance: number;
    })[]>;
    getEmployeeById(tenantHeader?: string, id?: string): Promise<{
        payrolls: {
            id: string;
            createdAt: Date;
            tenantId: string;
            status: string | null;
            employeeId: string;
            netPay: number | null;
            deductions: number | null;
            grossPay: number | null;
            payPeriod: string | null;
            period: string | null;
            grossAmount: number | null;
            netAmount: number | null;
            taxAmount: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        status: string | null;
        grossSalary: number | null;
        salary: number | null;
        employmentType: import(".prisma/client").$Enums.EmploymentType | null;
        position: string | null;
        firstName: string;
        lastName: string;
        department: string | null;
        jobTitle: string | null;
        leaveBalance: number;
    }>;
    processPayroll(tenantHeader?: string, dto?: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        status: string | null;
        employeeId: string;
        netPay: number | null;
        deductions: number | null;
        grossPay: number | null;
        payPeriod: string | null;
        period: string | null;
        grossAmount: number | null;
        netAmount: number | null;
        taxAmount: number | null;
    }>;
    getPayrollRecords(tenantHeader?: string): Promise<({
        employee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            tenantId: string;
            status: string | null;
            grossSalary: number | null;
            salary: number | null;
            employmentType: import(".prisma/client").$Enums.EmploymentType | null;
            position: string | null;
            firstName: string;
            lastName: string;
            department: string | null;
            jobTitle: string | null;
            leaveBalance: number;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        status: string | null;
        employeeId: string;
        netPay: number | null;
        deductions: number | null;
        grossPay: number | null;
        payPeriod: string | null;
        period: string | null;
        grossAmount: number | null;
        netAmount: number | null;
        taxAmount: number | null;
    })[]>;
}
