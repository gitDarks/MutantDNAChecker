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
exports.DNAChecker = void 0;
const nucleotide_model_1 = require("../models/nucleotide.model");
const context_1 = require("./searching-strategies/context");
const search_right_strategy_1 = require("./searching-strategies/concrete-strategies/search-right-strategy");
const search_rigth_down_strategy_1 = require("./searching-strategies/concrete-strategies/search-rigth-down-strategy");
const search_down_strategy_1 = require("./searching-strategies/concrete-strategies/search-down-strategy");
const search_left_down_strategy_1 = require("./searching-strategies/concrete-strategies/search-left-down-strategy");
const sequence_entity_1 = require("../../core/entities/sequence.entity");
const dna_sequence_service_1 = require("../services/dna_sequence.service");
const db_service_1 = require("../../core/services/db/db.service");
class DNAChecker {
    constructor() {
        this.dnaMatrixFull = [];
        this.dnaMatrix = [];
        this.sequenceCounter = 0;
        this.dnaSequenceService = new dna_sequence_service_1.DnaSequenceService();
    }
    isMutant(dna) {
        return __awaiter(this, void 0, void 0, function* () {
            const size = dna.length;
            const initTime = new Date().valueOf();
            // Mapeamos el array de entrada en un array 2D para hacer las busquedas en profundidad
            this.mapDnaMatrix(dna);
            // Verificar secuencia de ADN
            this.context = new context_1.SearchContext(size);
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    /*Realizar comparación con los nucleotidos de la horizontal a la derecha usando la estrategia de
                    busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
                    this.context.setStrategy(new search_right_strategy_1.SearchRightStrategy());
                    this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                    /*Realizar comparación con los nucleotidos de la diagonal derecha hacia abajo usando la
                    estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
                    secuencias*/
                    this.context.setStrategy(new search_rigth_down_strategy_1.SearchRightDownStrategy());
                    this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                    /*Realizar comparación con los nucleotidos de la vertical hacia abajo usando la estrategia de
                    busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
                    this.context.setStrategy(new search_down_strategy_1.SearchDownStrategy());
                    this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                    /*Realizar comparación con los nucleotidos de la diagonal izquierda hacia abajo usando la
                    estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
                    secuencias*/
                    this.context.setStrategy(new search_left_down_strategy_1.SearchLeftDownStrategy());
                    this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                }
            }
            /*no es necesario buscar en otras direcciones puesto que ya toda la matriz fue cubierta
            Si se encontraron 2 o más secuencias se determina que el DNA es de un mutante*/
            const isMutantDNA = this.sequenceCounter >= 2 ? true : false;
            // almacenar en BD
            this.saveDNASequence(dna.toString(), isMutantDNA ? "M" : "H");
            const endTime = new Date().valueOf();
            console.log("exec time: ", (endTime - initTime) / 1000);
            return isMutantDNA;
        });
    }
    mapDnaMatrix(dna) {
        this.dnaMatrixFull = new Array();
        let line = [];
        dna.forEach((value, j) => {
            line = value.split("");
            const row = new Array();
            line.forEach((nucleotide, i) => {
                row.push(new nucleotide_model_1.Nucleotide(nucleotide, i, j));
            });
            this.dnaMatrixFull.push(row);
        });
    }
    saveDNASequence(dna, subjectType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_service_1.ConnectionDB.getConnectionInstance();
                const dnaEntity = new sequence_entity_1.DNASequencesEntity();
                dnaEntity.sequence = dna;
                dnaEntity.subjectType = subjectType;
                yield this.dnaSequenceService.saveDNASequence(dnaEntity);
                yield db_service_1.ConnectionDB.closeConnection();
            }
            catch (e) {
                yield db_service_1.ConnectionDB.closeConnection();
                throw new Error(e);
            }
        });
    }
}
exports.DNAChecker = DNAChecker;
//# sourceMappingURL=dna-checker.controller.js.map