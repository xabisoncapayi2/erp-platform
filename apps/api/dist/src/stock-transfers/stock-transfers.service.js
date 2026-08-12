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
exports.StockTransfersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StockTransfersService = class StockTransfersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transfer(tenantId, dto) {
        if (dto.sourceWarehouseId === dto.destWarehouseId) {
            throw new common_1.BadRequestException('Source and destination warehouse cannot be the same.');
        }
        if (dto.quantity <= 0) {
            throw new common_1.BadRequestException('Transfer quantity must be positive.');
        }
        return this.prisma.$transaction(async (tx) => {
            const sourceItem = await tx.inventoryItem.findUnique({
                where: {
                    productId_warehouseId: {
                        productId: dto.productId,
                        warehouseId: dto.sourceWarehouseId,
                    },
                },
            });
            if (!sourceItem) {
                throw new common_1.NotFoundException(`No inventory for this product in the source warehouse.`);
            }
            if (sourceItem.quantityOnHand < dto.quantity) {
                throw new common_1.BadRequestException(`Cannot transfer ${dto.quantity} units: source warehouse only has ` +
                    `${sourceItem.quantityOnHand} on hand.`);
            }
            await tx.inventoryItem.update({
                where: { id: sourceItem.id },
                data: { quantityOnHand: { decrement: dto.quantity } },
            });
            const transferRecord = await tx.stockTransfer.create({
                data: {
                    tenantId,
                    productId: dto.productId,
                    sourceWarehouseId: dto.sourceWarehouseId,
                    destWarehouseId: dto.destWarehouseId,
                    quantity: dto.quantity,
                    status: client_1.StockTransferStatus.PENDING,
                },
            });
            await tx.inventoryMovement.create({
                data: {
                    tenantId,
                    inventoryItemId: sourceItem.id,
                    quantityChange: -dto.quantity,
                    reason: client_1.MovementReason.ADJUSTMENT,
                    referenceId: transferRecord.id,
                },
            });
            const destItem = await tx.inventoryItem.upsert({
                where: {
                    productId_warehouseId: {
                        productId: dto.productId,
                        warehouseId: dto.destWarehouseId,
                    },
                },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: {
                    tenantId,
                    productId: dto.productId,
                    warehouseId: dto.destWarehouseId,
                    quantityOnHand: dto.quantity,
                },
            });
            await tx.inventoryMovement.create({
                data: {
                    tenantId,
                    inventoryItemId: destItem.id,
                    quantityChange: dto.quantity,
                    reason: client_1.MovementReason.ADJUSTMENT,
                    referenceId: transferRecord.id,
                },
            });
            return tx.stockTransfer.update({
                where: { id: transferRecord.id },
                data: { status: client_1.StockTransferStatus.COMPLETED, completedAt: new Date() },
            });
        });
    }
};
exports.StockTransfersService = StockTransfersService;
exports.StockTransfersService = StockTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockTransfersService);
//# sourceMappingURL=stock-transfers.service.js.map