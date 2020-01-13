"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);
//# sourceMappingURL=errorHandlers.js.map