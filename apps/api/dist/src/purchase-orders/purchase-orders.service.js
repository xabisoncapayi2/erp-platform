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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PurchaseOrdersService = class PurchaseOrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.purchaseOrder.create({
            data,
        });
    }
    async findOne(id) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { lines: true },
        });
        if (!po) {
            throw new common_1.NotFoundException(`Purchase Order with ID ${id} not found`);
        }
        return po;
    }
    async updateStatus(id, status) {
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: status },
        });
    }
    async submit(id, tenantId) {
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: client_1.PurchaseOrderStatus.SUBMITTED },
            include: { lines: true },
        });
    }
    async receiveOrder(id, tenantId, dto) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { lines: true },
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase order not found');
        await this.prisma.$transaction(async (tx) => {
            for (const lineDto of dto.lines) {
                const poLine = po.lines.find((l) => l.id === lineDto.purchaseOrderLineId);
                if (!poLine)
                    continue;
                await tx.purchaseOrderLine.update({
                    where: { id: poLine.id },
                    data: { quantityReceived: { increment: lineDto.quantityReceived } },
                });
                if (po.warehouseId) {
                    const inventoryItem = await tx.inventoryItem.upsert({
                        where: {
                            productId_warehouseId: {
                                productId: poLine.productId,
                                warehouseId: po.warehouseId,
                            },
                        },
                        update: {
                            quantityOnHand: { increment: lineDto.quantityReceived },
                        },
                        create: {
                            tenantId,
                            productId: poLine.productId,
                            warehouseId: po.warehouseId,
                            quantityOnHand: lineDto.quantityReceived,
                        },
                    });
                    await tx.inventoryMovement.create({
                        data: {
                            tenantId,
                            inventoryItemId: inventoryItem.id,
                            quantityChange: lineDto.quantityReceived,
                            reason: client_1.MovementReason.PURCHASE_RECEIPT,
                            referenceId: po.id,
                        },
                    });
                }
            }
        });
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: client_1.PurchaseOrderStatus.RECEIVED },
            include: { lines: true },
        });
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map