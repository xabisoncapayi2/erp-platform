"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = require("bcrypt");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/erp_db?schema=public',
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo-tenant' },
        update: {},
        create: { slug: 'demo-tenant', name: 'Demo Tenant' },
    });
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@demo.test' },
        update: {},
        create: {
            tenantId: tenant.id,
            email: 'admin@demo.test',
            passwordHash,
            roles: ['procurement:approve', 'admin'],
        },
    });
    console.log('Seeded tenant:', tenant.slug);
    console.log('Seeded user:', user.email, '(password: password123)');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map