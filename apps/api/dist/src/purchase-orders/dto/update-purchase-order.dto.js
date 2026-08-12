"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePurchaseOrderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_po_dto_1 = require("./create-po.dto");
class UpdatePurchaseOrderDto extends (0, mapped_types_1.PartialType)(create_po_dto_1.CreatePODto) {
}
exports.UpdatePurchaseOrderDto = UpdatePurchaseOrderDto;
//# sourceMappingURL=update-purchase-order.dto.js.map