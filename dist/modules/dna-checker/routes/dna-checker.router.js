"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dna_checker_controller_1 = __importDefault(require("../controllers/dna-checker.controller"));
class MutantRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        try {
            this.router.post("/mutant", dna_checker_controller_1.default.checkisMutant);
        }
        catch (error) {
            console.log(error);
        }
    }
}
const mutantRouter = new MutantRouter();
exports.default = mutantRouter.router;
//# sourceMappingURL=dna-checker.router.js.map