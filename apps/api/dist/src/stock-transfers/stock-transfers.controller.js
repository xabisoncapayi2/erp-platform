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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransfersController = void 0;
const common_1 = require("@nestjs/common");
const stock_transfers_service_1 = require("./stock-transfers.service");
let StockTransfersController = class StockTransfersController {
    constructor(service) {
        this.service = service;
    }
    async transfer(tenantHeader, dto) {
        return this.service.transfer((tenantHeader || "default-tenant"), dto);
    }
};
exports.StockTransfersController = StockTransfersController;
__decorate([
    (0, common_1.Post)("transfer"),
    __param(0, (0, common_1.Headers)("x-tenant-id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StockTransfersController.prototype, "transfer", null);
exports.StockTransfersController = StockTransfersController = __decorate([
    (0, common_1.Controller)("stock-transfers"),
    __metadata("design:paramtypes", [stock_transfers_service_1.StockTransfersService])
], StockTransfersController);
//# sourceMappingURL=stock-transfers.controller.js.map