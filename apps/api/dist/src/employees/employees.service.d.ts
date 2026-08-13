import { PrismaService } from '../prisma/prisma.service';
import { EmploymentType } from '@prisma/client';
export interface CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    idNumber: string;
    employmentType: EmploymentType;
    grossSalary: number;
}
export interface RequestLeaveDto {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
}
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateEmployeeDto): import(".prisma/client").Prisma.Prisma__EmployeeClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    requestLeave(tenantId: string, dto: RequestLeaveDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        tenantId: string;
        status: import(".prisma/client").$Enums.LeaveStatus;
        reason: string | null;
        leaveType: string | null;
        startDate: Date;
        endDate: Date;
        daysRequested: number | null;
        approvedById: string | null;
        processedAt: Date | null;
        employeeId: string;
    }>;
    decideLeave(tenantId: string, leaveId: string, decision: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        tenantId: string;
        status: import(".prisma/client").$Enums.LeaveStatus;
        reason: string | null;
        leaveType: string | null;
        startDate: Date;
        endDate: Date;
        daysRequested: number | null;
        approvedById: string | null;
        processedAt: Date | null;
        employeeId: string;
    }>;
}
