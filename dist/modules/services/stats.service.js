"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
class Stats {
    static getStats() {
        this.calcRatio();
        return ('"count_mutant_dna": ' +
            this.countMutantDna +
            ', "count_human_dna": ' +
            this.countHumanDna +
            ', "ratio": ' +
            this.ratio);
    }
    static calcRatio() {
        this.ratio = this.countMutantDna / this.countHumanDna;
    }
}
exports.Stats = Stats;
Stats.countMutantDna = 40;
Stats.countHumanDna = 100;
//# sourceMappingURL=stats.service.js.map