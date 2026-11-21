import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/erp_db?schema=public',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding demo data...');

  // Deleting tenants cascades down to all dependent records
  await prisma.tenant.deleteMany({});

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      id: 'tenant-acme-sa',
      slug: 'acme-sa',
      name: 'Acme Enterprises South Africa',
    },
  });

  // 2. User
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@acme.co.za',
      passwordHash: '$2b$10$5bGQjix47oSx2AP7T0OVze8znI.ACPIw4NPOhQKToRdkj.XN4fJ4q',
      roles: ['ADMIN'],
    },
  });

  // 3. Warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      tenantId: tenant.id,
      name: 'Gauteng Distribution Hub',
    },
  });

  // 4. Product
  const product = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      sku: 'VALVE-001',
      name: 'Industrial Control Valve 50mm',
      unitCost: new Prisma.Decimal(150.0),
      unitPrice: new Prisma.Decimal(250.0),
    },
  });

  // 5. Inventory Item
  await prisma.inventoryItem.create({
    data: {
      tenantId: tenant.id,
      productId: product.id,
      warehouseId: warehouse.id,
      quantityOnHand: 250,
    },
  });

  // 6. Employee
  await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Sibusiso',
      lastName: 'Nkosi',
      email: 'sibusiso@acme.co.za',
      department: 'Operations',
      jobTitle: 'Plant Lead',
      grossSalary: new Prisma.Decimal(48000.0),
      salary: new Prisma.Decimal(48000.0),
    },
  });

  // 7. General Ledger Entry
  await prisma.generalLedgerEntry.create({
    data: {
      tenantId: tenant.id,
      description: 'System Opening Balances',
      lines: {
        create: [
          { accountCode: '1000', debit: new Prisma.Decimal(150000.0), credit: new Prisma.Decimal(0.0) },
          { accountCode: '1100', debit: new Prisma.Decimal(85000.0), credit: new Prisma.Decimal(0.0) },
          { accountCode: '3000', debit: new Prisma.Decimal(0.0), credit: new Prisma.Decimal(235000.0) },
        ],
      },
    },
  });

  console.log('Demo data seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
