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
const dna_checker_controller_1 = require("../controllers/dna-checker.controller");
class MutantRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        try {
            this.router.post("/mutant", (rq, rs) => __awaiter(this, void 0, void 0, function* () {
                // Leer secuencia de ADN desde el request
                const dnaSequence = rq.body.dna;
                const dnaChecker = new dna_checker_controller_1.DNAChecker();
                const isMutant = yield dnaChecker.isMutant(dnaSequence);
                if (isMutant) {
                    rs.status(200).send("200-OK");
                }
                else {
                    rs.status(403).send("403-Forbidden  ");
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
}
const mutantRouter = new MutantRouter();
exports.default = mutantRouter.router;
//# sourceMappingURL=dna-checker.router.js.map