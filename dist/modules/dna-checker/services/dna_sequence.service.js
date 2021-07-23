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
exports.DnaSequenceService = void 0;
const sequence_entity_1 = require("../../core/entities/sequence.entity");
const db_service_1 = require("../../core/services/db/db.service");
class DnaSequenceService {
    saveDNASequence(dnaSequence) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = yield db_service_1.ConnectionDB.getQueryRunner();
            try {
                yield db_service_1.ConnectionDB.startTransaction(queryRunner);
                const dnaSequenceSaved = yield queryRunner.manager.save(sequence_entity_1.DNASequencesEntity, dnaSequence);
                yield db_service_1.ConnectionDB.commitTransaction(queryRunner);
                return dnaSequenceSaved;
            }
            catch (e) {
                yield db_service_1.ConnectionDB.rollbackTransaction(queryRunner);
                throw new Error("Error saving DNA Sequence" + e);
            }
        });
    }
}
exports.DnaSequenceService = DnaSequenceService;
//# sourceMappingURL=dna_sequence.service.js.map