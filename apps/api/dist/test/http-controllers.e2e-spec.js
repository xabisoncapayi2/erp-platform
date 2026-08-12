"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('HTTP Controllers E2E', () => {
    let app;
    let prisma;
    const TENANT_ID = 'http-e2e-tenant-id';
    const TENANT_SLUG = 'http-e2e-tenant-slug';
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
        await prisma.tenant.upsert({
            where: { slug: TENANT_SLUG },
            update: {},
            create: { id: TENANT_ID, name: 'HTTP E2E Tenant', slug: TENANT_SLUG },
        });
    });
    afterAll(async () => {
        await prisma.generalLedgerLine.deleteMany({ where: { generalLedgerEntry: { tenantId: TENANT_ID } } });
        await prisma.generalLedgerEntry.deleteMany({ where: { tenantId: TENANT_ID } });
        await app.close();
    });
    describe('POST /general-ledger/entries', () => {
        it('rejects payload missing required fields with 400 Bad Request', () => {
            return request(app.getHttpServer())
                .post('/general-ledger/entries')
                .set('x-tenant-id', TENANT_ID)
                .send({})
                .expect(400);
        });
    });
});
//# sourceMappingURL=http-controllers.e2e-spec.js.map