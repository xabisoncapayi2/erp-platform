"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardMetrics(tenantId) {
        const [orders, inventoryItems, productsCount] = await Promise.all([
            this.prisma.salesOrder.findMany({
                where: { tenantId },
                include: { lines: true },
            }),
            this.prisma.inventoryItem.findMany({
                where: { tenantId },
                include: { product: true },
            }),
            this.prisma.product.count({
                where: { tenantId },
            }),
        ]);
        let totalRevenue = 0;
        let fulfilledOrdersCount = 0;
        let pendingOrdersCount = 0;
        for (const order of orders) {
            if (order.status === client_1.SalesOrderStatus.FULFILLED) {
                fulfilledOrdersCount++;
                for (const line of order.lines) {
                    totalRevenue += Number(line.quantity || 0) * Number(line.unitPrice || 0);
                }
            }
            else {
                pendingOrdersCount++;
            }
        }
        let inventoryValuation = 0;
        let totalStockQuantity = 0;
        let lowStockCount = 0;
        for (const item of inventoryItems) {
            const qty = Number(item.quantityOnHand || 0);
            const unitCost = Number(item.product?.unitCost || 0);
            const minStock = Number(item.minStockLevel || item.product?.minStockLevel || 0);
            totalStockQuantity += qty;
            inventoryValuation += qty * unitCost;
            if (minStock > 0 && qty <= minStock) {
                lowStockCount++;
            }
        }
        return {
            totalRevenue,
            totalOrders: orders.length,
            fulfilledOrdersCount,
            pendingOrdersCount,
            inventoryValuation,
            totalStockQuantity,
            totalProducts: productsCount,
            lowStockCount,
        };
    }
    async getMonthlySales(tenantId, year, month) {
        let targetYear = typeof year === 'object' && year !== null ? year.year : year;
        let targetMonth = typeof year === 'object' && year !== null ? year.month : month;
        const fulfilledOrders = await this.prisma.salesOrder.findMany({
            where: {
                tenantId,
                status: client_1.SalesOrderStatus.FULFILLED,
            },
            include: {
                lines: true,
            },
            orderBy: {
                fulfilledAt: 'asc',
            },
        });
        const monthlyMap = new Map();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        let grandTotalRevenue = 0;
        for (const order of fulfilledOrders) {
            const date = order.fulfilledAt || order.createdAt;
            const orderYear = date.getFullYear();
            const orderMonth = date.getMonth() + 1;
            if (targetYear && Number(targetYear) !== orderYear) {
                continue;
            }
            if (targetMonth && Number(targetMonth) !== orderMonth) {
                continue;
            }
            const key = `${orderYear}-${String(orderMonth).padStart(2, '0')}`;
            let orderRevenue = 0;
            for (const line of order.lines) {
                orderRevenue += Number(line.quantity || 0) * Number(line.unitPrice || 0);
            }
            grandTotalRevenue += orderRevenue;
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, {
                    year: orderYear,
                    month: orderMonth,
                    monthName: monthNames[orderMonth - 1],
                    totalSales: 0,
                    orderCount: 0,
                });
            }
            const current = monthlyMap.get(key);
            current.totalSales += orderRevenue;
            current.orderCount += 1;
        }
        const list = Array.from(monthlyMap.values());
        return Object.assign(list, {
            totalRevenue: grandTotalRevenue,
            invoiceCount: fulfilledOrders.length,
        });
    }
    async getTopSellingProducts(tenantId, limit = 5) {
        const fulfilledOrders = await this.prisma.salesOrder.findMany({
            where: {
                tenantId,
                status: client_1.SalesOrderStatus.FULFILLED,
            },
            include: {
                lines: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const productMap = new Map();
        for (const order of fulfilledOrders) {
            for (const line of order.lines) {
                const pId = line.productId;
                const qty = Number(line.quantity || 0);
                const revenue = qty * Number(line.unitPrice || 0);
                const name = line.product?.name || `Product ${pId}`;
                const sku = line.product?.sku || '';
                if (!productMap.has(pId)) {
                    productMap.set(pId, {
                        productId: pId,
                        productName: name,
                        sku,
                        totalQuantity: 0,
                        totalQuantitySold: 0,
                        totalRevenue: 0,
                    });
                }
                const stats = productMap.get(pId);
                stats.totalQuantity += qty;
                stats.totalQuantitySold += qty;
                stats.totalRevenue += revenue;
            }
        }
        const sorted = Array.from(productMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
        return sorted.slice(0, Number(limit));
    }
    async getInventoryValuationByWarehouse(tenantId) {
        const inventoryItems = await this.prisma.inventoryItem.findMany({
            where: { tenantId },
            include: {
                warehouse: true,
                product: true,
            },
        });
        const warehouseMap = new Map();
        for (const item of inventoryItems) {
            const wId = item.warehouseId;
            const wName = item.warehouse?.name || `Warehouse ${wId}`;
            const qty = Number(item.quantityOnHand || 0);
            const unitCost = Number(item.product?.unitCost || 0);
            const valuation = qty * unitCost;
            if (!warehouseMap.has(wId)) {
                warehouseMap.set(wId, {
                    warehouseId: wId,
                    warehouseName: wName,
                    itemCount: 0,
                    totalQuantity: 0,
                    totalValuation: 0,
                    totalValue: 0,
                });
            }
            const stats = warehouseMap.get(wId);
            stats.itemCount += 1;
            stats.totalQuantity += qty;
            stats.totalValuation += valuation;
            stats.totalValue += valuation;
        }
        return Array.from(warehouseMap.values());
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map