import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveStatus, EmploymentType } from '@prisma/client';

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

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  create(tenantId: string, dto: CreateEmployeeDto) {
    return this.prisma.employee.create({ data: { tenantId, ...dto } });
  }

  async requestLeave(tenantId: string, dto: RequestLeaveDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, tenantId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee ${dto.employeeId} not found.`);
    }
    if (dto.endDate < dto.startDate) {
      throw new BadRequestException('endDate cannot be before startDate.');
    }

    const days = Math.ceil(
      (dto.endDate.getTime() - dto.startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

    return this.prisma.leaveRequest.create({
      data: {
        tenantId,
        employeeId: dto.employeeId,
        startDate: dto.startDate,
        endDate: dto.endDate,
        reason: dto.reason,
        status: LeaveStatus.PENDING,
      },
    });
  }

  async decideLeave(tenantId: string, leaveId: string, decision: 'APPROVED' | 'REJECTED') {
    const leave = await this.prisma.leaveRequest.findFirst({ where: { id: leaveId, tenantId } });
    if (!leave) {
      throw new NotFoundException(`Leave request ${leaveId} not found.`);
    }
    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(`Leave request is already ${leave.status}.`);
    }
    return this.prisma.leaveRequest.update({
      where: { id: leaveId },
      data: { status: decision },
    });
  }
}
