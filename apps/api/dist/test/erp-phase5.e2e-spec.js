"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
const supplier_invoices_service_1 = require("../src/supplier-invoices/supplier-invoices.service");
const general_ledger_service_1 = require("../src/general-ledger/general-ledger.service");
const purchase_orders_service_1 = require("../src/purchase-orders/purchase-orders.service");
const client_1 = require("@prisma/client");
describe('Phase 5: Supplier Invoices (Three-Way Matching) & General Ledger', () => {
    let app;
    let prisma;
    let supplierInvoicesService;
    let glService;
    let purchaseOrdersService;
    const TENANT_ID = `tenant-e2e-phase5-${Date.now()}`;
    let supplierId;
    let productId;
    let poId;
    let poLineId;
    async function cleanupTestData() {
        await prisma.generalLedgerLine.deleteMany({
            where: { generalLedgerEntry: { tenantId: TENANT_ID } },
        });
        await prisma.generalLedgerEntry.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.supplierInvoiceLine.deleteMany({
            where: { supplierInvoice: { tenantId: TENANT_ID } },
        });
        await prisma.supplierInvoice.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.purchaseOrderLine.deleteMany({
            where: { purchaseOrder: { tenantId: TENANT_ID } },
        });
        await prisma.purchaseOrder.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.product.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.supplier.deleteMany({ where: { tenantId: TENANT_ID } });
    }
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
        supplierInvoicesService = app.get(supplier_invoices_service_1.SupplierInvoicesService);
        glService = app.get(general_ledger_service_1.GeneralLedgerService);
        purchaseOrdersService = app.get(purchase_orders_service_1.PurchaseOrdersService);
        await prisma.tenant.upsert({
            where: { slug: 'phase-5-e2e-tenant' },
            update: {},
            create: { id: TENANT_ID, name: 'Phase 5 E2E Tenant', slug: 'phase-5-e2e-tenant' },
        });
        await cleanupTestData();
        await prisma.tenant.upsert({
            where: { id: TENANT_ID },
            update: {},
            create: { id: TENANT_ID, slug: TENANT_ID, name: 'Phase 5 E2E Tenant' },
        });
        const supplier = await prisma.supplier.create({
            data: { tenantId: TENANT_ID, name: 'Full Suite Supplier Ltd', email: `supplier-p5-${Date.now()}@e2e.com` },
        });
        supplierId = supplier.id;
        const product = await prisma.product.create({
            data: {
                tenantId: TENANT_ID,
                sku: `SKU-PHASE5-${Date.now()}`,
                name: 'Enterprise Widget',
                unitCost: 200.0,
                unitPrice: 350.0,
            },
        });
        productId = product.id;
        const po = await prisma.purchaseOrder.create({
            data: {
                tenantId: TENANT_ID,
                supplierId,
                status: 'SUBMITTED',
                lines: { create: [{ productId, quantityOrdered: 3, unitCost: 200.0 }] },
            },
            include: { lines: true },
        });
        poId = po.id;
        const poWithLines = await prisma.purchaseOrder.findUniqueOrThrow({
            where: { id: po.id },
            include: { lines: true },
        });
        poLineId = poWithLines.lines[0].id;
        await purchaseOrdersService.receiveOrder(poId, TENANT_ID, {
            lines: [{ purchaseOrderLineId: poLineId, quantityReceived: 3 }],
        });
    });
    afterAll(async () => {
        await cleanupTestData();
        await app.close();
    });
    describe('Three-way matching', () => {
        it('accepts an invoice for exactly the ordered quantity at the agreed price', async () => {
            const invoice = await supplierInvoicesService.create(TENANT_ID, {
                supplierId,
                purchaseOrderId: poId,
                invoiceNumber: `INV-${Date.now()}-VALID`,
                subTotal: 600,
                taxTotal: 60,
                grandTotal: 660,
                dueDate: new Date(),
                lines: [
                    {
                        purchaseOrderLineId: poLineId,
                        productId,
                        quantity: 3,
                        unitPrice: 200.0,
                        total: 600,
                    },
                ],
            });
            expect(invoice.status).toBe(client_1.SupplierInvoiceStatus.PENDING_MATCHING);
        });
        it('rejects an invoice quantity exceeding PO quantity', async () => {
            await expect(supplierInvoicesService.create(TENANT_ID, {
                supplierId,
                purchaseOrderId: poId,
                invoiceNumber: `INV-${Date.now()}-OVERBILL`,
                subTotal: 1000,
                taxTotal: 100,
                grandTotal: 1100,
                dueDate: new Date(),
                lines: [
                    { purchaseOrderLineId: poLineId, productId, quantity: 5, unitPrice: 200.0, total: 1000 },
                ],
            })).rejects.toThrow(/available to invoice|exceeds PO quantity/i);
        });
        it('rejects an invoice with a unit price that does not match the PO', async () => {
            await expect(supplierInvoicesService.create(TENANT_ID, {
                supplierId,
                purchaseOrderId: poId,
                invoiceNumber: `INV-${Date.now()}-PRICEVAR`,
                subTotal: 250,
                taxTotal: 25,
                grandTotal: 275,
                dueDate: new Date(),
                lines: [
                    {
                        purchaseOrderLineId: poLineId,
                        productId,
                        quantity: 1,
                        unitPrice: 250.0,
                        total: 250,
                    },
                ],
            })).rejects.toThrow(/price variance/i);
        });
    });
    describe('Double-entry General Ledger', () => {
        it('rejects an unbalanced journal entry', async () => {
            await expect(glService.createEntry(TENANT_ID, {
                description: 'Unbalanced test entry',
                lines: [
                    { accountCode: '1000', debit: 500, credit: 0 },
                    { accountCode: '2000', debit: 0, credit: 400 },
                ],
            })).rejects.toThrow(/does not balance/i);
        });
        it('rejects a line with both debit and credit set', async () => {
            await expect(glService.createEntry(TENANT_ID, {
                description: 'Invalid line test',
                lines: [
                    { accountCode: '1000', debit: 100, credit: 100 },
                    { accountCode: '2000', debit: 0, credit: 100 },
                ],
            })).rejects.toThrow(/exactly one of debit or credit/i);
        });
        it('posts a balanced entry and reflects it correctly in the trial balance', async () => {
            const entry = await glService.createEntry(TENANT_ID, {
                description: 'Inventory purchase accrual',
                reference: 'INV-PHASE5-TEST',
                lines: [
                    { accountCode: '1000', debit: 600, credit: 0 },
                    { accountCode: '2000', debit: 0, credit: 600 },
                ],
            });
            expect(entry.status).toBe('POSTED');
            const trialBalance = await glService.getTrialBalance(TENANT_ID);
            const inventoryAccount = trialBalance.find((a) => a.accountCode === '1000');
            const apAccount = trialBalance.find((a) => a.accountCode === '2000');
            expect(inventoryAccount?.debit).toBe(600);
            expect(apAccount?.credit).toBe(600);
            const totalDebits = trialBalance.reduce((sum, a) => sum + a.debit, 0);
            const totalCredits = trialBalance.reduce((sum, a) => sum + a.credit, 0);
            expect(totalDebits).toBe(totalCredits);
        });
    });
});
//# sourceMappingURL=erp-phase5.e2e-spec.js.map