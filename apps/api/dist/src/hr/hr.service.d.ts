import { PrismaService } from "../prisma/prisma.service";
export declare class HrService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createEmployee(tenantId: string, dto: any): Promise<{
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
    getEmployees(tenantId: string): Promise<({
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
    getEmployeeById(tenantId: string, id: string): Promise<{
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
    processPayroll(tenantId: string, dto: any): Promise<{
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
    getPayrollRecords(tenantId: string): Promise<({
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
