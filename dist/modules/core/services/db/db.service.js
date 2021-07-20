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
exports.ConnectionDB = void 0;
require("reflect-metadata");
const config_1 = require("../../../../modules/config");
const typeorm_1 = require("typeorm");
class ConnectionDB {
    static getConnectionInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            ConnectionDB.concurrentCalleds++;
            console.log("CONCURRENT CALLEDS ON START CONNECTION %s", ConnectionDB.concurrentCalleds);
            console.log("[START] %o", ConnectionDB.connectionInstance);
            const connectionManager = yield typeorm_1.getConnectionManager();
            if (connectionManager.connections.length > 0) {
                const aliveConnection = connectionManager.get("default");
                if (aliveConnection.isConnected) {
                    console.log("[INFO] ALIVE-CONNECTION => %o", aliveConnection.isConnected);
                    ConnectionDB.connection = yield aliveConnection;
                }
                else {
                    ConnectionDB.restoreSingleton();
                }
                console.log("SETTED OF EXISTENT CONNECTION");
            }
            if (!ConnectionDB.connectionInstance) {
                try {
                    ConnectionDB.connectionInstance = new ConnectionDB();
                    ConnectionDB.connection = yield ConnectionDB.runConnection();
                    console.log("FINISH CREATE CONNECTION");
                }
                catch (error) {
                    console.log("ERROR ON GET CONNECTION %O", error);
                    ConnectionDB.restoreSingleton();
                    throw new Error("ERROR ON GET CONNECTION");
                }
            }
            return ConnectionDB.connectionInstance;
        });
    }
    static getQueryRunner() {
        return __awaiter(this, void 0, void 0, function* () {
            return ConnectionDB.connection.createQueryRunner();
        });
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return ConnectionDB.connection;
        });
    }
    static startTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.startTransaction();
        });
    }
    static commitTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.commitTransaction();
            yield queryRunner.release();
        });
    }
    static rollbackTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.rollbackTransaction();
        });
    }
    static closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DB START CLOSING CONNECTION]`);
            try {
                console.log("CONCURRENT CALLEDS on CLOSE CONNECTION %s", ConnectionDB.concurrentCalleds);
                if (ConnectionDB.concurrentCalleds <= 1) {
                    if (Object.keys(ConnectionDB.connection).length > 0) {
                        const connection = yield ConnectionDB.getConnection();
                        yield connection.close();
                        ConnectionDB.restoreSingleton();
                        console.log("[INFO] CLOSED CONNECTION, CONNECTIONDB => %o", ConnectionDB.connectionInstance);
                    }
                    else {
                        console.log("[WARNING]CANNOT CLOSE CONNECTION OF INEXISTENT ATTRIBUTE, CONNECTIONDB => %o", ConnectionDB);
                    }
                }
                else {
                    ConnectionDB.concurrentCalleds--;
                    if (ConnectionDB.concurrentCalleds === 1) {
                        yield ConnectionDB.closeConnection();
                    }
                }
            }
            catch (error) {
                console.log("[ERROR]Error in closeConnection %o", error);
            }
        });
    }
    static restoreSingleton() {
        ConnectionDB.connectionInstance = null;
        ConnectionDB.concurrentCalleds = 0;
        ConnectionDB.connection = {};
    }
    static runConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[DB NEW CONNECTION]`);
                return yield typeorm_1.createConnection({
                    acquireTimeout: Number(yield config_1.getVariable("DATABASE_TIMEOUT")),
                    connectTimeout: Number(yield config_1.getVariable("DATABASE_TIMEOUT")),
                    database: yield config_1.getVariable("DB_NAME"),
                    entities: [`${__dirname}/../../../**/*.entity{.ts,.js}`],
                    extra: {
                        connectionLimit: 300,
                    },
                    host: yield config_1.getVariable("DB_HOST"),
                    password: yield config_1.getVariable("DB_PASSWORD"),
                    port: +(yield config_1.getVariable("DB_PORT")),
                    synchronize: false,
                    type: "mysql",
                    username: yield config_1.getVariable("DB_USER"),
                });
            }
            catch (error) {
                console.log(`[ERROR-DB] ${error}`);
                return Promise.reject({
                    message: "Could not connect to DB",
                    error: `${error}`,
                });
            }
        });
    }
}
exports.ConnectionDB = ConnectionDB;
ConnectionDB.concurrentCalleds = 0;
//# sourceMappingURL=db.service.js.map