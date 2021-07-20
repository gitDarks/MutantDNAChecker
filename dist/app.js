"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_router_1 = __importDefault(require("./modules/core/routes/index.router"));
const db_service_1 = require("./modules/core/services/db/db.service");
const dna_checker_router_1 = __importDefault(require("./modules/dna-checker/routes/dna-checker.router"));
const stats_router_1 = __importDefault(require("./modules/stats/routes/stats.router"));
const PORT = process.env.PORT || 3050;
const app = express_1.default();
app.use(express_1.default.json());
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${PORT}`);
});
app.use("/", index_router_1.default);
app.use("/", dna_checker_router_1.default);
app.use("/", stats_router_1.default);
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_service_1.ConnectionDB.getConnectionInstance();
        return next();
    }
    catch (e) {
        return res.send(500, e.message);
    }
}));
//# sourceMappingURL=app.js.map