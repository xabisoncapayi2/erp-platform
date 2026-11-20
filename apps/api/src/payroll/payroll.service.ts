import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateMonthlyPaye(grossMonthly: number): number {
    const annualGross = grossMonthly * 12;
    let annualTax = 0;

    if (annualGross <= 237100) {
      annualTax = annualGross * 0.18;
    } else if (annualGross <= 370500) {
      annualTax = 42678 + (annualGross - 237100) * 0.26;
    } else if (annualGross <= 512800) {
      annualTax = 77362 + (annualGross - 370500) * 0.31;
    } else if (annualGross <= 673000) {
      annualTax = 121475 + (annualGross - 512800) * 0.36;
    } else if (annualGross <= 857900) {
      annualTax = 179147 + (annualGross - 673000) * 0.39;
    } else if (annualGross <= 1817000) {
      annualTax = 251258 + (annualGross - 857900) * 0.41;
    } else {
      annualTax = 644489 + (annualGross - 1817000) * 0.45;
    }

    const primaryRebate = 17235;
    const netAnnualTax = Math.max(0, annualTax - primaryRebate);
    return Math.round((netAnnualTax / 12) * 100) / 100;
  }

  private calculateMonthlyUif(grossMonthly: number): number {
    const maxMonthlyUif = 177.12;
    return Math.min(Math.round(grossMonthly * 0.01 * 100) / 100, maxMonthlyUif);
  }

  async runPayrollForEmployee(tenantId: string, employeeId: string, period: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const grossPay = Number((employee as any).grossSalary || (employee as any).salary || 0);
    const paye = this.calculateMonthlyPaye(grossPay);
    const uif = this.calculateMonthlyUif(grossPay);
    const totalDeductions = paye + uif;
    const netPay = grossPay - totalDeductions;

    const paySlipData: any = {
      tenantId,
      employeeId,
      period,
      paye,
      uif,
      deductions: totalDeductions,
      netPay,
      status: 'PROCESSED',
      grossSalary: grossPay,
    };

    return (this.prisma as any).paySlip.create({
      data: paySlipData,
    });
  }
}
