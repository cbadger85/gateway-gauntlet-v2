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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const users_entity_1 = __importDefault(require("./users.entity"));
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
let UserRepository = class UserRepository {
    constructor(repository) {
        this.repository = repository;
        this.saveUser = (user) => this.repository.save(user);
        this.findUser = (id) => this.repository.findOne(id);
    }
};
UserRepository = __decorate([
    typedi_1.Service(),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(users_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserRepository);
exports.default = UserRepository;
//# sourceMappingURL=users.repository.js.map