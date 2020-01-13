"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const users_service_1 = __importDefault(require("./users.service"));
exports.saveUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userService = typedi_1.Container.get(users_service_1.default);
    const user = yield userService.addUser(req.body);
    res.send(user);
});
exports.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userService = typedi_1.Container.get(users_service_1.default);
    const user = yield userService.getUser(parseFloat(req.params.id));
    res.send(user);
});
exports.default = { saveUser: exports.saveUser, getUser: exports.getUser };
//# sourceMappingURL=users.controller.js.map