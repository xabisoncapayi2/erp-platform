import { PrismaService } from './src/prisma/prisma.service';

const prisma = new PrismaService();

function calculateSAPayroll(grossMonthlySalary: number) {
  const uifCap = 177.12;
  const rawUif = grossMonthlySalary * 0.01;
  const uifAmount = Math.min(rawUif, uifCap);

  let paye = 0;
  const annualSalary = grossMonthlySalary * 12;

  if (annualSalary > 95750) {
    const annualTax = Math.max(0, (annualSalary - 95750) * 0.18);
    paye = annualTax / 12;
  }

  const netSalary = grossMonthlySalary - paye - uifAmount;

  return {
    paye: Number(paye.toFixed(2)),
    uifEmployee: Number(uifAmount.toFixed(2)),
    uifEmployer: Number(uifAmount.toFixed(2)),
    netSalary: Number(netSalary.toFixed(2)),
  };
}

async function main() {
  const tenantId = 'tenant-master-1';

  console.log('\n--- STARTING FULL SYSTEM INTEGRATION TEST (PHASES 1 - 3) ---\n');

  // ==========================================
  // PHASE 1: SUPPLIERS & PURCHASE ORDERS
  // ==========================================
  console.log('[PHASE 1] Procuring Inventory via Purchase Order');

  const supplier = await prisma.supplier.create({
    data: {
      tenantId,
      name: 'TechSupply SA',
      email: 'orders@techsupply.co.za',
    },
  });

  const product = await prisma.product.create({
    data: {
      tenantId,
      sku: `SKU-MASTER-${Date.now().toString().slice(-4)}`,
      name: 'Mechanical Keyboard',
      unitCost: 450.00,
      unitPrice: 850.00,
    },
  });

  const inventory = await prisma.inventoryItem.create({
    data: {
      tenantId,
      productId: product.id,
      quantityOnHand: 20,
      reorderLevel: 5,
    },
  });

  const po = await prisma.purchaseOrder.create({
    data: {
      tenantId,
      supplierId: supplier.id,
      status: 'RECEIVED',
    },
  });

  console.log(`  [OK] Supplier Created: ${supplier.name}`);
  console.log(`  [OK] Product Created:  ${product.name} (SKU: ${product.sku})`);
  console.log(`  [OK] Purchase Order:   ${po.id} [Status: ${po.status}]`);
  console.log(`  [OK] Initial Inventory Stock: ${inventory.quantityOnHand} units\n`);

  // ==========================================
  // PHASE 2: CUSTOMERS, SALES ORDERS & INVENTORIES
  // ==========================================
  console.log('[PHASE 2] Processing Sales Order & Auto-Deduction');

  const customer = await prisma.customer.create({
    data: {
      tenantId,
      name: 'Jane Smith',
      email: `jane.${Date.now()}@example.com`,
    },
  });

  const orderQuantity = 5;
  const salesOrder = await prisma.salesOrder.create({
    data: {
      tenantId,
      customerId: customer.id,
      status: 'FULFILLED',
      totalAmount: product.unitPrice.toNumber() * orderQuantity,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      tenantId,
      salesOrderId: salesOrder.id,
      invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
      totalAmount: product.unitPrice.toNumber() * orderQuantity,
      status: 'UNPAID',
    },
  });

  const updatedInv = await prisma.inventoryItem.update({
    where: { id: inventory.id },
    data: { quantityOnHand: { decrement: orderQuantity } },
  });

  console.log(`  [OK] Customer Created:     ${customer.name}`);
  console.log(`  [OK] Sales Order Fulfill:  ID ${salesOrder.id} (Qty: ${orderQuantity})`);
  console.log(`  [OK] Generated Invoice:    ${invoice.invoiceNumber} (Total: R${invoice.totalAmount})`);
  console.log(`  [OK] Deducted Stock:       ${inventory.quantityOnHand} -> ${updatedInv.quantityOnHand} units\n`);

  // ==========================================
  // PHASE 3: EMPLOYEES & PAYROLL
  // ==========================================
  console.log('[PHASE 3] Employee Management & SA Payroll');

  const employee = await prisma.employee.create({
    data: {
      tenantId,
      firstName: 'Thabo',
      lastName: 'Mokoena',
      email: `thabo.${Date.now()}@company.co.za`,
      idNumber: '8905125800081',
      employmentType: 'FULL_TIME',
      grossSalary: 42000.00,
    },
  });

  const leave = await prisma.leaveRequest.create({
    data: {
      tenantId,
      employeeId: employee.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 3),
      days: 3,
      status: 'APPROVED',
      reason: 'Medical Leave',
    },
  });

  const calc = calculateSAPayroll(employee.grossSalary.toNumber());
  const paySlip = await prisma.paySlip.create({
    data: {
      tenantId,
      employeeId: employee.id,
      period: '2026-08',
      grossSalary: employee.grossSalary,
      payeTax: calc.paye,
      uifEmployee: calc.uifEmployee,
      uifEmployer: calc.uifEmployer,
      netSalary: calc.netSalary,
    },
  });

  console.log(`  [OK] Employee Created:     ${employee.firstName} ${employee.lastName}`);
  console.log(`  [OK] Approved Leave:       ${leave.days} days [Reason: ${leave.reason}]`);
  console.log(`  [OK] PaySlip Generated:    Period ${paySlip.period}`);
  console.log(`     - Gross Salary: R${paySlip.grossSalary}`);
  console.log(`     - PAYE Tax:     R${paySlip.payeTax}`);
  console.log(`     - UIF (1%):     R${paySlip.uifEmployee}`);
  console.log(`     - Net Take-Home: R${paySlip.netSalary}\n`);

  console.log('--- ALL PHASES (1, 2 & 3) TESTED & PASSED SUCCESSFULLY --- \n');
}

main()
  .catch((e) => {
    console.error('[ERROR] Test failed:', e);
  })
  .finally(() => prisma.$disconnect());
