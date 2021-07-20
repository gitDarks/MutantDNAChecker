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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
class StatsRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        try {
            this.router.get("/stats", (rq, rs) => __awaiter(this, void 0, void 0, function* () {
                const stats = new stats_controller_1.Stats();
                rs.send("Stats are: " + (yield stats.getStats()));
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
}
const statsRouter = new StatsRouter();
exports.default = statsRouter.router;
//# sourceMappingURL=stats.router.js.map