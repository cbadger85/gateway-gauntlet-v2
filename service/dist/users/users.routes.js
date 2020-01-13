"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const errorHandlers_1 = require("../handlers/errorHandlers");
const userRoutes = express_1.default.Router();
userRoutes.post('/', errorHandlers_1.asyncHandler(users_controller_1.saveUser));
userRoutes.get('/:id', errorHandlers_1.asyncHandler(users_controller_1.getUser));
exports.default = userRoutes;
//# sourceMappingURL=users.routes.js.map