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
exports.StatsService = void 0;
const db_service_1 = require("../../core/services/db/db.service");
const sequence_entity_1 = require("../../core/entities/sequence.entity");
class StatsService {
    countDNASequencesBySubject(subjectType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryRunner = yield db_service_1.ConnectionDB.getQueryRunner();
                // @ts-ignore
                const [sequences, count] = yield queryRunner.manager.findAndCount(sequence_entity_1.DNASequencesEntity, {
                    subjectType,
                });
                return count;
            }
            catch (error) {
                console.log("[ERROR] couting DNA sequences by subject type %o", error);
                throw new Error(error);
            }
        });
    }
}
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map