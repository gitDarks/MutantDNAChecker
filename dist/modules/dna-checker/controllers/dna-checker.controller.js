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
        this.sequenceCounter = 0;
        this.dnaSequenceService = new dna_sequence_service_1.DnaSequenceService();
    }
    isMutant(dna) {
        const size = dna.length;
        const initTime = new Date().valueOf();
        // Verificar secuencia de ADN
        dNACheckerController.context = new context_1.SearchContext(size);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                /*Realizar comparación con los nucleotidos de la horizontal a la derecha usando la estrategia de
                busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
                dNACheckerController.context.setStrategy(new search_right_strategy_1.SearchRightStrategy());
                dNACheckerController.sequenceCounter =
                    dNACheckerController.context.search(i, j, dNACheckerController.dnaMatrixFull)
                        ? dNACheckerController.sequenceCounter + 1
                        : dNACheckerController.sequenceCounter;
                /*Realizar comparación con los nucleotidos de la diagonal derecha hacia abajo usando la
                estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
                secuencias*/
                dNACheckerController.context.setStrategy(new search_rigth_down_strategy_1.SearchRightDownStrategy());
                dNACheckerController.sequenceCounter =
                    dNACheckerController.context.search(i, j, dNACheckerController.dnaMatrixFull)
                        ? dNACheckerController.sequenceCounter + 1
                        : dNACheckerController.sequenceCounter;
                /*Realizar comparación con los nucleotidos de la vertical hacia abajo usando la estrategia de
                busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
                dNACheckerController.context.setStrategy(new search_down_strategy_1.SearchDownStrategy());
                dNACheckerController.sequenceCounter =
                    dNACheckerController.context.search(i, j, dNACheckerController.dnaMatrixFull)
                        ? dNACheckerController.sequenceCounter + 1
                        : dNACheckerController.sequenceCounter;
                /*Realizar comparación con los nucleotidos de la diagonal izquierda hacia abajo usando la
                estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
                secuencias*/
                dNACheckerController.context.setStrategy(new search_left_down_strategy_1.SearchLeftDownStrategy());
                dNACheckerController.sequenceCounter =
                    dNACheckerController.context.search(i, j, dNACheckerController.dnaMatrixFull)
                        ? dNACheckerController.sequenceCounter + 1
                        : dNACheckerController.sequenceCounter;
            }
        }
        /*no es necesario buscar en otras direcciones puesto que ya toda la matriz fue cubierta
        Si se encontraron 2 o más secuencias se determina que el DNA es de un mutante*/
        const isMutantDNA = dNACheckerController.sequenceCounter >= 2 ? true : false;
        const endTime = new Date().valueOf();
        console.log("exec time: ", (endTime - initTime) / 1000);
        return isMutantDNA;
    }
    mapDnaMatrix(dna) {
        dNACheckerController.dnaMatrixFull = new Array();
        let line = [];
        let val = true;
        // Dado que la longitud máxima permitida en la BD es de 400, solo se puede tener una secuencia de 14X14
        if (dna && dna.length > 4 && dna.length <= 14) {
            for (const value of dna) {
                line = value.split("");
                // Verificar que la secuencia de ADN sea de NXN
                if (dna.length === value.length) {
                    const row = new Array();
                    for (const nucleotide of line) {
                        // verificar que el nucleótido sea válido
                        if (["A", "C", "G", "T"].includes(nucleotide)) {
                            row.push(new nucleotide_model_1.Nucleotide(nucleotide));
                        }
                        else {
                            val = false;
                            break;
                        }
                    }
                    dNACheckerController.dnaMatrixFull.push(row);
                }
                else {
                    val = false;
                    break;
                }
            }
        }
        else {
            val = false;
        }
        return val;
    }
    saveDNASequence(dna, subjectType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dnaEntity = new sequence_entity_1.DNASequencesEntity();
                dnaEntity.sequence = dna;
                dnaEntity.subjectType = subjectType;
                const result = yield dNACheckerController.dnaSequenceService.saveDNASequence(dnaEntity);
                yield db_service_1.ConnectionDB.closeConnection();
                return result;
            }
            catch (e) {
                console.log("saveDNASequence Error: ", e);
                yield db_service_1.ConnectionDB.closeConnection();
                throw new Error(e);
            }
        });
    }
    checkisMutant(rq, rs) {
        try {
            // Leer secuencia de ADN desde el request
            const request = rq.body;
            const dnaSequence = request.dna;
            // Validamos el request y mapeamos el array de entrada en un array 2D para hacer las busquedas en profundidad
            const isValidRequest = dNACheckerController.mapDnaMatrix(dnaSequence);
            if (isValidRequest) {
                // Verificar si el ADN es mutante
                const isMutant = dNACheckerController.isMutant(dnaSequence);
                // almacenar en BD
                dNACheckerController.saveDNASequence(dnaSequence.toString(), isMutant ? "M" : "H");
                if (isMutant) {
                    rs.status(200).send("200-OK");
                }
                else {
                    rs.status(403).send("403-Forbidden");
                }
            }
            else {
                rs.status(400).send("400-Bad request");
            }
        }
        catch (error) {
            return rs
                .status(500)
                .send({ error: error.message || JSON.stringify(error) });
        }
    }
}
exports.DNAChecker = DNAChecker;
const dNACheckerController = new DNAChecker();
exports.default = dNACheckerController;
//# sourceMappingURL=dna-checker.controller.js.map