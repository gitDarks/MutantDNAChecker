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
exports.Stats = void 0;
const db_service_1 = require("../../core/services/db/db.service");
const stats_service_1 = require("../services/stats.service");
class Stats {
    constructor() {
        this.statsService = new stats_service_1.StatsService();
    }
    getStats(rq, rs) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Contar los registros en base de datos de las secuencias de ADN de mutantes y humanos
            Si la cantidad de mutantes es cero, el ratio es cero
            Si la cantidad de humanos es cero, el ratio es 1 o la cantidad de mutantes / la cantidad de mutantes
            de lo contrario el ratio es la cantidad de mutantes/la cantidad de humanos */
            try {
                statsController.countMutantDna =
                    (yield statsController.statsService.countDNASequencesBySubject("M")) ||
                        0;
                statsController.countHumanDna =
                    (yield statsController.statsService.countDNASequencesBySubject("H")) ||
                        0;
                statsController.ratio =
                    statsController.countMutantDna > 0
                        ? statsController.countMutantDna /
                            (statsController.countHumanDna > 0
                                ? statsController.countHumanDna
                                : statsController.countMutantDna)
                        : 0;
                yield db_service_1.ConnectionDB.closeConnection();
                const result = '"count_mutant_dna": ' +
                    statsController.countMutantDna +
                    ', "count_human_dna": ' +
                    statsController.countHumanDna +
                    ', "ratio": ' +
                    statsController.ratio;
                return rs.status(200).send("Stats are: " + result);
            }
            catch (error) {
                yield db_service_1.ConnectionDB.closeConnection();
                return rs
                    .status(500)
                    .send({ error: error.message || JSON.stringify(error) });
            }
        });
    }
}
exports.Stats = Stats;
const statsController = new Stats();
exports.default = statsController;
//# sourceMappingURL=stats.controller.js.map