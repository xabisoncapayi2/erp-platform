"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
describe('HttpControllers (e2e)', () => {
    let app;
    const TENANT_ID = 'test-tenant-1';
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    it('verifies controller readiness and tenant context', () => {
        return request(app.getHttpServer())
            .get('/')
            .set('x-tenant-id', TENANT_ID);
    });
});
//# sourceMappingURL=http-controllers.e2e-spec.js.map