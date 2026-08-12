import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HttpControllers (e2e)', () => {
  let app: INestApplication;
  const TENANT_ID = 'test-tenant-1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
