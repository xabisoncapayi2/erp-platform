"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('Purchase Orders E2E', () => {
    let app;
    let prisma;
    const TENANT_ID = 'po-e2e-tenant-id';
    const TENANT_SLUG = 'po-e2e-tenant-slug';
    const SUPPLIER_ID = 'supp-456';
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
        await prisma.tenant.upsert({
            where: { slug: TENANT_SLUG },
            update: {},
            create: { id: TENANT_ID, name: 'PO E2E Tenant', slug: TENANT_SLUG },
        });
        await prisma.supplier.upsert({
            where: { id: SUPPLIER_ID },
            update: {},
            create: {
                id: SUPPLIER_ID,
                tenantId: TENANT_ID,
                name: 'Test Supplier',
            },
        });
    });
    afterAll(async () => {
        await prisma.purchaseOrderLine.deleteMany({ where: { purchaseOrder: { tenantId: TENANT_ID } } });
        await prisma.purchaseOrder.deleteMany({ where: { tenantId: TENANT_ID } });
        await prisma.supplier.deleteMany({ where: { id: SUPPLIER_ID } });
        await app.close();
    });
    it('should create and verify a Purchase Order', async () => {
        const po = await prisma.purchaseOrder.create({
            data: {
                tenantId: TENANT_ID,
                supplierId: SUPPLIER_ID,
                status: 'DRAFT',
            },
        });
        expect(po).toBeDefined();
        expect(po.supplierId).toBe(SUPPLIER_ID);
    });
});
//# sourceMappingURL=purchase-orders.e2e-spec.js.map