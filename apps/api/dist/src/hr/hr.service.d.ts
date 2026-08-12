import { PrismaService } from '../prisma/prisma.service';
export interface CreateLeaveRequestDto {
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    daysRequested: number;
}
export declare class HrService {
    private prisma;
    constructor(prisma: PrismaService);
    calculateAccruedLeave(startDate: Date): number;
    requestLeave(tenantId: string, dto: CreateLeaveRequestDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LeaveStatus;
        leaveType: string;
        startDate: Date;
        endDate: Date;
        daysRequested: number;
        approvedById: string | null;
        processedAt: Date | null;
        employeeId: string;
    }>;
    processLeaveApproval(tenantId: string, leaveRequestId: string, approved: boolean, approverId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LeaveStatus;
        leaveType: string;
        startDate: Date;
        endDate: Date;
        daysRequested: number;
        approvedById: string | null;
        processedAt: Date | null;
        employeeId: string;
    }>;
}
