import { PrismaService } from '../prisma/prisma.service';
export declare class PayrollService {
    private prisma;
    constructor(prisma: PrismaService);
    runPayrollForEmployee(tenantId: string, employeeId: string, period: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        grossSalary: number | null;
        employeeId: string;
        period: string;
        uifEmployer: number | null;
        uifEmployee: number | null;
        tax: number | null;
        netSalary: number | null;
        payeTax: number | null;
        uifDeduction: number | null;
    }>;
    runPayrollForAllEmployees(tenantId: string, period: string): Promise<any[]>;
}
