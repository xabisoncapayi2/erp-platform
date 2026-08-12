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
exports.SalesOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const general_ledger_service_1 = require("../general-ledger/general-ledger.service");
const client_1 = require("@prisma/client");
let SalesOrdersService = class SalesOrdersService {
    constructor(prisma, glService) {
        this.prisma = prisma;
        this.glService = glService;
    }
    async create(tenantId, dto) {
        const rawLines = dto.lines || [];
        return this.prisma.salesOrder.create({
            data: {
                tenantId,
                customerId: dto.customerId,
                warehouseId: dto.warehouseId,
                status: client_1.SalesOrderStatus.DRAFT,
                lines: {
                    create: rawLines.map((l) => ({
                        productId: l.productId,
                        quantity: Number(l.quantity || 0),
                        unitPrice: Number(l.unitPrice || 0),
                    })),
                },
            },
            include: { lines: true },
        });
    }
    async fulfill(orderId, tenantId) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findFirst({
                where: { id: orderId, tenantId },
                include: {
                    lines: {
                        include: { product: true },
                    },
                },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Sales order ${orderId} not found`);
            }
            if (order.status === client_1.SalesOrderStatus.FULFILLED) {
                throw new common_1.BadRequestException(`Sales order ${orderId} is already fulfilled`);
            }
            let totalRevenue = 0;
            let totalCost = 0;
            for (const line of order.lines) {
                const qty = Number(line.quantity);
                const price = Number(line.unitPrice);
                totalRevenue += qty * price;
                const inventory = await tx.inventoryItem.findUnique({
                    where: {
                        productId_warehouseId: {
                            productId: line.productId,
                            warehouseId: order.warehouseId,
                        },
                    },
                    include: { product: true },
                });
                if (!inventory || inventory.quantityOnHand < qty) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${line.productId} in warehouse ${order.warehouseId}`);
                }
                const unitCost = Number(inventory.product?.unitCost || line.product?.unitCost || 0);
                totalCost += qty * unitCost;
                await tx.inventoryItem.update({
                    where: { id: inventory.id },
                    data: {
                        quantityOnHand: { decrement: qty },
                    },
                });
            }
            const updatedOrder = await tx.salesOrder.update({
                where: { id: order.id },
                data: {
                    status: client_1.SalesOrderStatus.FULFILLED,
                    fulfilledAt: new Date(),
                },
                include: { lines: true },
            });
            await this.glService.createEntry(tenantId, {
                description: `Fulfillment for Sales Order ${order.id}`,
                lines: [
                    { accountCode: '1100', debit: totalRevenue, credit: 0 },
                    { accountCode: '4000', debit: 0, credit: totalRevenue },
                    { accountCode: '5000', debit: totalCost, credit: 0 },
                    { accountCode: '1000', debit: 0, credit: totalCost },
                ],
            }, tx);
            return {
                order: updatedOrder,
                totalRevenue,
                totalCost,
            };
        });
    }
};
exports.SalesOrdersService = SalesOrdersService;
exports.SalesOrdersService = SalesOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        general_ledger_service_1.GeneralLedgerService])
], SalesOrdersService);
//# sourceMappingURL=sales-orders.service.js.map