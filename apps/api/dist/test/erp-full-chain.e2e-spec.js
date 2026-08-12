"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
const purchase_orders_service_1 = require("../src/purchase-orders/purchase-orders.service");
const stock_transfers_service_1 = require("../src/stock-transfers/stock-transfers.service");
const sales_orders_service_1 = require("../src/sales-orders/sales-orders.service");
const general_ledger_service_1 = require("../src/general-ledger/general-ledger.service");
const analytics_service_1 = require("../src/analytics/analytics.service");
const client_1 = require("@prisma/client");
describe('Full chain: Supplier -> PO -> Warehouse -> Inventory -> Customer Order -> Invoice -> Analytics', () => {
    let app;
    let prisma;
    let purchaseOrdersService;
    let stockTransfersService;
    let salesOrdersService;
    let glService;
    let analyticsService;
    const TENANT_ID = 'tenant-e2e-full-chain';
    const BUYER_ID = 'user-e2e-buyer';
    let warehouseAId;
    let warehouseBId;
    let supplierId;
    let productId;
    let customerId;
    async function cleanupTestData() {
        await prisma.generalLedgerLine.deleteMany({
            where: { generalLedgerEntry: { tenantId: TENANT_ID } },
        });
        await prisma.generalLedgerEntry.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.invoice.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.salesOrderLine.deleteMany({
            where: { salesOrder: { tenantId: TENANT_ID } },
        });
        await prisma.salesOrder.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.stockTransfer.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.inventoryMovement.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.purchaseOrderLine.deleteMany({
            where: { purchaseOrder: { tenantId: TENANT_ID } },
        });
        await prisma.purchaseOrder.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.inventoryItem.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.customer.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.product.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.supplier.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.warehouse.deleteMany({ where: { tenantId: TENANT_ID } });
    }
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
        purchaseOrdersService = app.get(purchase_orders_service_1.PurchaseOrdersService);
        stockTransfersService = app.get(stock_transfers_service_1.StockTransfersService);
        salesOrdersService = app.get(sales_orders_service_1.SalesOrdersService);
        glService = app.get(general_ledger_service_1.GeneralLedgerService);
        analyticsService = app.get(analytics_service_1.AnalyticsService);
        await prisma.tenant.upsert({
            where: { id: TENANT_ID },
            update: {},
            create: { id: TENANT_ID, name: 'Full Chain E2E Tenant', slug: 'full-chain-e2e-tenant' },
        });
        await cleanupTestData();
        const warehouseA = await prisma.warehouse.create({
            data: { tenantId: TENANT_ID, name: 'Cape Town DC' },
        });
        warehouseAId = warehouseA.id;
        const warehouseB = await prisma.warehouse.create({
            data: { tenantId: TENANT_ID, name: 'Johannesburg DC' },
        });
        warehouseBId = warehouseB.id;
        const supplier = await prisma.supplier.create({
            data: { tenantId: TENANT_ID, name: 'Full Chain Supplier', email: 'supplier@fullchain.test' },
        });
        supplierId = supplier.id;
        const product = await prisma.product.create({
            data: {
                tenantId: TENANT_ID,
                sku: `SKU-FULLCHAIN-${Date.now()}`,
                name: 'Enterprise Widget',
                unitCost: 200.0,
                unitPrice: 350.0,
            },
        });
        productId = product.id;
        const customer = await prisma.customer.create({
            data: { tenantId: TENANT_ID, name: 'Johannesburg Retail Co', email: 'buyer@jhbretail.test' },
        });
        customerId = customer.id;
    });
    afterAll(async () => {
        await cleanupTestData();
        await app.close();
    });
    it('Step 1: receives 20 units into Warehouse A via a real PO', async () => {
        const po = await prisma.purchaseOrder.create({
            data: {
                tenantId: TENANT_ID,
                supplierId,
                warehouseId: warehouseAId,
                createdById: BUYER_ID,
                status: client_1.PurchaseOrderStatus.DRAFT,
                lines: { create: [{ productId, quantityOrdered: 20, unitCost: 200.0 }] },
            },
            include: { lines: true },
        });
        const submitted = await purchaseOrdersService.submit(po.id, TENANT_ID);
        expect(submitted.status).toBe(client_1.PurchaseOrderStatus.SUBMITTED);
        const received = await purchaseOrdersService.receiveOrder(po.id, TENANT_ID, {
            lines: [{ purchaseOrderLineId: po.lines[0].id, quantityReceived: 20 }],
        });
        expect(received.status).toBe(client_1.PurchaseOrderStatus.RECEIVED);
        const stockA = await prisma.inventoryItem.findUnique({
            where: { productId_warehouseId: { productId, warehouseId: warehouseAId } },
        });
        expect(stockA?.quantityOnHand).toBe(20);
    });
    it('Step 2: transfers 8 units from Warehouse A to Warehouse B', async () => {
        const transfer = await stockTransfersService.transfer(TENANT_ID, {
            productId,
            sourceWarehouseId: warehouseAId,
            destWarehouseId: warehouseBId,
            quantity: 8,
        });
        expect(transfer.status).toBe('COMPLETED');
        const stockA = await prisma.inventoryItem.findUnique({
            where: { productId_warehouseId: { productId, warehouseId: warehouseAId } },
        });
        const stockB = await prisma.inventoryItem.findUnique({
            where: { productId_warehouseId: { productId, warehouseId: warehouseBId } },
        });
        expect(stockA?.quantityOnHand).toBe(12);
        expect(stockB?.quantityOnHand).toBe(8);
    });
    it('rejects a transfer requesting more than the source warehouse has', async () => {
        await expect(stockTransfersService.transfer(TENANT_ID, {
            productId,
            sourceWarehouseId: warehouseAId,
            destWarehouseId: warehouseBId,
            quantity: 999,
        })).rejects.toThrow(/only.*on hand/i);
    });
    it('Step 3: fulfills a customer order from Warehouse B and posts real GL entries', async () => {
        const order = await salesOrdersService.create(TENANT_ID, {
            customerId,
            warehouseId: warehouseBId,
            lines: [{ productId, quantity: 5, unitPrice: 350.0 }],
        });
        expect(order.status).toBe(client_1.SalesOrderStatus.DRAFT);
        const result = await salesOrdersService.fulfill(order.id, TENANT_ID);
        expect(result.order.status).toBe(client_1.SalesOrderStatus.FULFILLED);
        expect(result.totalRevenue).toBe(1750);
        expect(result.totalCost).toBe(1000);
        const stockB = await prisma.inventoryItem.findUnique({
            where: { productId_warehouseId: { productId, warehouseId: warehouseBId } },
        });
        expect(stockB?.quantityOnHand).toBe(3);
        const stockA = await prisma.inventoryItem.findUnique({
            where: { productId_warehouseId: { productId, warehouseId: warehouseAId } },
        });
        expect(stockA?.quantityOnHand).toBe(12);
    });
    it('rejects fulfilling from a warehouse without enough stock, even if another warehouse has it', async () => {
        const order = await salesOrdersService.create(TENANT_ID, {
            customerId,
            warehouseId: warehouseAId,
            lines: [{ productId, quantity: 999, unitPrice: 350.0 }],
        });
        await expect(salesOrdersService.fulfill(order.id, TENANT_ID)).rejects.toThrow(/insufficient stock/i);
    });
    it('Step 4: cross-checks the General Ledger reflects the sale correctly and balances', async () => {
        const trialBalance = await glService.getTrialBalance(TENANT_ID);
        const ar = trialBalance.find((a) => a.accountCode === '1100');
        const revenue = trialBalance.find((a) => a.accountCode === '4000');
        const cogs = trialBalance.find((a) => a.accountCode === '5000');
        const inventoryAccount = trialBalance.find((a) => a.accountCode === '1000');
        expect(ar?.debit).toBe(1750);
        expect(revenue?.credit).toBe(1750);
        expect(cogs?.debit).toBe(1000);
        expect(inventoryAccount?.credit).toBe(1000);
        const totalDebits = trialBalance.reduce((sum, a) => sum + a.debit, 0);
        const totalCredits = trialBalance.reduce((sum, a) => sum + a.credit, 0);
        expect(totalDebits).toBe(totalCredits);
    });
    it('Step 5: cross-checks Analytics against the same underlying data', async () => {
        const now = new Date();
        const monthlySales = await analyticsService.getMonthlySales(TENANT_ID, now.getFullYear(), now.getMonth() + 1);
        expect(monthlySales.invoiceCount).toBe(1);
        expect(monthlySales.totalRevenue).toBe(1750);
        const topProducts = await analyticsService.getTopSellingProducts(TENANT_ID);
        const ourProduct = topProducts.find((p) => p.productId === productId);
        expect(ourProduct?.totalQuantitySold).toBe(5);
        const valuation = await analyticsService.getInventoryValuationByWarehouse(TENANT_ID);
        const warehouseAValuation = valuation.find((w) => w.warehouseId === warehouseAId);
        const warehouseBValuation = valuation.find((w) => w.warehouseId === warehouseBId);
        expect(warehouseAValuation?.totalValue).toBe(2400);
        expect(warehouseBValuation?.totalValue).toBe(600);
    });
});
//# sourceMappingURL=erp-full-chain.e2e-spec.js.map