"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = __importDefault(require("../controllers/stats.controller"));
class StatsRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        try {
            this.router.get("/stats", stats_controller_1.default.getStats);
        }
        catch (error) {
            console.log(error);
        }
    }
}
const statsRouter = new StatsRouter();
exports.default = statsRouter.router;
//# sourceMappingURL=stats.router.js.map