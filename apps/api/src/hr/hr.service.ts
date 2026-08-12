import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveStatus } from '@prisma/client';

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
}

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  calculateAccruedLeave(startDate: Date): number {
    const now = new Date();
    const monthsWorked =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());

    return Math.max(0, Math.floor(monthsWorked * 1.25));
  }

  async requestLeave(tenantId: string, dto: CreateLeaveRequestDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }

    return this.prisma.leaveRequest.create({
      data: {
        tenantId,
        employeeId: dto.employeeId,
        leaveType: dto.leaveType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        daysRequested: dto.daysRequested,
        status: LeaveStatus.PENDING,
      },
    });
  }

  async processLeaveApproval(
    tenantId: string,
    leaveRequestId: string,
    approved: boolean,
    approverId: string,
  ) {
    const leaveRequest = await this.prisma.leaveRequest.findFirst({
      where: { id: leaveRequestId, tenantId },
      include: { employee: true },
    });

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request ${leaveRequestId} not found`);
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(`Leave request is already processed`);
    }

    const newStatus = approved ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;

    return this.prisma.$transaction(async (tx) => {
      if (approved) {
        await tx.employee.update({
          where: { id: leaveRequest.employeeId },
          data: {
            leaveBalance: { decrement: leaveRequest.daysRequested },
          },
        });
      }

      return tx.leaveRequest.update({
        where: { id: leaveRequestId },
        data: {
          status: newStatus,
          approvedById: approverId,
          processedAt: new Date(),
        },
      });
    });
  }
}
