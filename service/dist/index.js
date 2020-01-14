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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const server_1 = __importStar(require("./server"));
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        typeorm_1.useContainer(typedi_1.Container);
        const ormConfig = yield typeorm_1.getConnectionOptions();
        const config = process.env.NODE_ENV === 'production'
            ? Object.assign({}, ormConfig, { entities: ['dist/**/*entity.js'] }) : ormConfig;
        yield typeorm_1.createConnection().catch(e => console.error(e));
        yield server_1.default();
        const port = process.env.PORT || 4444;
        server_1.app.listen(port, () => {
            console.log(`App is listening on port: ${port}`);
        });
    });
})();
//# sourceMappingURL=index.js.map