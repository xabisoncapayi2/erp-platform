import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  calculateSATax(grossSalary: number) {
    const annualGross = grossSalary * 12;
    let annualTax = 0;

    if (annualGross <= 237100) {
      annualTax = annualGross * 0.18;
    } else if (annualGross <= 370500) {
      annualTax = 42678 + 0.26 * (annualGross - 237100);
    } else if (annualGross <= 512800) {
      annualTax = 77362 + 0.31 * (annualGross - 370500);
    } else if (annualGross <= 673000) {
      annualTax = 121475 + 0.36 * (annualGross - 512800);
    } else if (annualGross <= 857900) {
      annualTax = 179147 + 0.39 * (annualGross - 673000);
    } else if (annualGross <= 1817000) {
      annualTax = 251258 + 0.41 * (annualGross - 857900);
    } else {
      annualTax = 644489 + 0.45 * (annualGross - 1817000);
    }

    const primaryRebate = 17235;
    const netAnnualTax = Math.max(0, annualTax - primaryRebate);
    const monthlyPaye = Number((netAnnualTax / 12).toFixed(2));
    const monthlyUif = Number(Math.min(grossSalary * 0.01, 177.12).toFixed(2));
    const totalDeductions = Number((monthlyPaye + monthlyUif).toFixed(2));
    const netPay = Number((grossSalary - totalDeductions).toFixed(2));

    return {
      paye: monthlyPaye,
      uif: monthlyUif,
      deductions: totalDeductions,
      netPay,
    };
  }

  async runPayrollForEmployee(tenantId: string, employeeId: string, period: string) {
    try {
      const employee = await (this.prisma as any).employee.findFirst({
        where: { id: employeeId, tenantId },
      });

      if (!employee) {
        throw new NotFoundException(`Employee ${employeeId} not found for tenant ${tenantId}`);
      }

      const grossSalary = Number(employee.salary || employee.grossSalary || 0);
      const taxCalculation = this.calculateSATax(grossSalary);

      let createdRecord;
      if ((this.prisma as any).paySlip) {
        createdRecord = await (this.prisma as any).paySlip.create({
          data: {
            tenantId,
            employeeId: employee.id,
            period,
            grossSalary,
            payeTax: taxCalculation.paye,
            uifDeduction: taxCalculation.uif,
            uifEmployee: taxCalculation.uif,
            netSalary: taxCalculation.netPay,
          },
        });
      } else if ((this.prisma as any).payrollRecord) {
        createdRecord = await (this.prisma as any).payrollRecord.create({
          data: {
            tenantId,
            employeeId: employee.id,
            period,
            grossSalary,
            paye: taxCalculation.paye,
            uif: taxCalculation.uif,
            deductions: taxCalculation.deductions,
            netPay: taxCalculation.netPay,
          },
        });
      } else {
        throw new Error('Neither paySlip nor payrollRecord model exists in Prisma schema');
      }

      return {
        ...createdRecord,
        grossSalary,
        paye: taxCalculation.paye,
        uif: taxCalculation.uif,
        deductions: taxCalculation.deductions,
        netPay: taxCalculation.netPay,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Prisma Payroll Creation Error:', error);
      throw new BadRequestException(`Payroll calculation failed: ${error.message || error}`);
    }
  }
}
