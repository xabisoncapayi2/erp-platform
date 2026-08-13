import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HrService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(tenantId: string, dto: any) {
    return this.prisma.employee.create({
      data: {
        tenantId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        department: dto.department,
        position: dto.position,
        salary: Number(dto.salary),
        status: dto.status || "ACTIVE",
      },
    });
  }

  async getEmployees(tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId },
      include: { payrolls: true },
    });
  }

  async getEmployeeById(tenantId: string, id: string) {
    const emp = await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: { payrolls: true },
    });
    if (!emp) throw new NotFoundException(`Employee with ID ${id} not found`);
    return emp;
  }

  async processPayroll(tenantId: string, dto: any) {
    const gross = Number(dto.grossPay);
    const deductions = Number(dto.deductions || 0);
    const netPay = gross - deductions;

    return this.prisma.payrollRecord.create({
      data: {
        tenantId,
        employeeId: dto.employeeId,
        payPeriod: dto.payPeriod,
        grossPay: gross,
        deductions,
        netPay,
        status: dto.status || "PROCESSED",
      },
    });
  }

  async getPayrollRecords(tenantId: string) {
    return this.prisma.payrollRecord.findMany({
      where: { tenantId },
      include: { employee: true },
    });
  }
}
