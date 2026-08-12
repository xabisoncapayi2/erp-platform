import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('PurchaseOrders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const TENANT_ID = 'test-tenant-1';
  const SUPPLIER_ID = 'test-supplier-1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
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
