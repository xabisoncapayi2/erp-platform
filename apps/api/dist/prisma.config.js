"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
exports.default = (0, config_1.defineConfig)({
    migrations: {
        seed: 'ts-node ./prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/erp_db?schema=public',
    },
});
//# sourceMappingURL=prisma.config.js.map