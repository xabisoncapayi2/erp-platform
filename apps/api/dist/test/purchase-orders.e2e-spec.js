"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('PurchaseOrders (e2e)', () => {
    let app;
    let prisma;
    const TENANT_ID = 'test-tenant-1';
    const SUPPLIER_ID = 'test-supplier-1';
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        prisma = app.get(prisma_service_1.PrismaService);
        await app.init();
    });
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    it('verifies purchase order service and database context', async () => {
        expect(prisma).toBeDefined();
    });
});
//# sourceMappingURL=purchase-orders.e2e-spec.js.map