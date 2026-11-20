import { Injectable, NotFoundException, BadRequestException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollService } from '../payroll/payroll.service';
import { EmploymentType } from '@prisma/client';

export class CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  idNumber: string;
  employmentType: EmploymentType;
  grossSalary: number;
}

@Injectable()
export class HrService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly payrollService?: PayrollService,
  ) {}

  async createEmployee(tenantId: string, dto: CreateEmployeeDto) {
    if (!dto.firstName || !dto.lastName || !dto.employmentType || !dto.grossSalary) {
      throw new BadRequestException(
        'firstName, lastName, employmentType, and grossSalary are required.',
      );
    }

    const data: any = {
      tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      employmentType: dto.employmentType,
      grossSalary: dto.grossSalary,
    };

    if (dto.idNumber) {
      data.idNumber = dto.idNumber;
    }

    return (this.prisma.employee as any).create({
      data,
    });
  }

  async getEmployees(tenantId: string) {
    return (this.prisma.employee as any).findMany({
      where: { tenantId },
      include: { paySlips: true },
    });
  }

  async getEmployeeById(tenantId: string, id: string) {
    const emp = await (this.prisma.employee as any).findFirst({
      where: { id, tenantId },
      include: { paySlips: true },
    });
    if (!emp) throw new NotFoundException(`Employee with ID ${id} not found`);
    return emp;
  }

  async processPayroll(tenantId: string, dto: { employeeId: string; period: string }) {
    if (!this.payrollService) {
      throw new BadRequestException('PayrollService is not available');
    }
    return this.payrollService.runPayrollForEmployee(tenantId, dto.employeeId, dto.period);
  }

  async getPayrollRecords(tenantId: string) {
    return (this.prisma.paySlip as any).findMany({
      where: { tenantId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
