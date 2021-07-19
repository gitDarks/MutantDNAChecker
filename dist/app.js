"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dna_checker_service_1 = require("./modules/services/dna-checker.service");
const stats_service_1 = require("./modules/services/stats.service");
const PORT = process.env.PORT || 3050;
const app = express_1.default();
app.use(express_1.default.json());
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${PORT}`);
});
// routes
app.get("/health", (rq, rs) => {
    rs.send("API OK!");
});
// Check if DNA Sequence belongs to a mutant
app.post("/mutant", (rq, rs) => {
    console.log("---mutant---");
    // Leer secuencia de ADN desde el request
    const dnaSequence = rq.body.dna;
    const dnaChecker = new dna_checker_service_1.DNAChecker();
    const isMutant = dnaChecker.isMutant(dnaSequence);
    if (isMutant) {
        rs.status(200).send("200-OK");
    }
    else {
        rs.status(403).send("403-Forbidden  ");
    }
});
app.get("/stats", (rq, rs) => {
    rs.send("Stats are: " + stats_service_1.Stats.getStats());
});
//# sourceMappingURL=app.js.map