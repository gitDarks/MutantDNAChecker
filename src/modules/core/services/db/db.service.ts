import "reflect-metadata";
import { getVariable } from "../../../../modules/config";
import {
  Connection,
  createConnection,
  getConnectionManager,
  QueryRunner,
} from "typeorm";
import { DNASequencesEntity } from "../../entities/sequence.entity";

export class ConnectionDB {
  public static async getConnectionInstance(): Promise<ConnectionDB> {
    ConnectionDB.concurrentCalleds++;
    console.log(
      "CONCURRENT CALLEDS ON START CONNECTION %s",
      ConnectionDB.concurrentCalleds
    );
    console.log("[START] %o", ConnectionDB.connectionInstance);
    const connectionManager = await getConnectionManager();
    if (connectionManager.connections.length > 0) {
      const aliveConnection = connectionManager.get("default");
      if (aliveConnection.isConnected) {
        console.log(
          "[INFO] ALIVE-CONNECTION => %o",
          aliveConnection.isConnected
        );
        ConnectionDB.connection = await aliveConnection;
      } else {
        ConnectionDB.restoreSingleton();
      }
      console.log("SETTED OF EXISTENT CONNECTION");
    }

    if (!ConnectionDB.connectionInstance) {
      try {
        ConnectionDB.connectionInstance = new ConnectionDB();
        ConnectionDB.connection = await ConnectionDB.runConnection();
        console.log("FINISH CREATE CONNECTION");
      } catch (error) {
        console.log("ERROR ON GET CONNECTION %O", error);
        ConnectionDB.restoreSingleton();
        throw new Error("ERROR ON GET CONNECTION");
      }
    }

    return ConnectionDB.connectionInstance;
  }

  public static async getQueryRunner(): Promise<QueryRunner> {
    return ConnectionDB.connection.createQueryRunner();
  }

  public static async getConnection(): Promise<Connection> {
    return ConnectionDB.connection;
  }

  public static async startTransaction(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.startTransaction();
  }

  public static async commitTransaction(
    queryRunner: QueryRunner
  ): Promise<any> {
    await queryRunner.commitTransaction();
    await queryRunner.release();
  }

  public static async rollbackTransaction(
    queryRunner: QueryRunner
  ): Promise<any> {
    await queryRunner.rollbackTransaction();
  }

  public static async closeConnection(): Promise<any> {
    console.log(`[DB START CLOSING CONNECTION]`);
    try {
      console.log(
        "CONCURRENT CALLEDS on CLOSE CONNECTION %s",
        ConnectionDB.concurrentCalleds
      );
      if (ConnectionDB.concurrentCalleds <= 1) {
        if (Object.keys(ConnectionDB.connection).length > 0) {
          const connection = await ConnectionDB.getConnection();
          await connection.close();
          ConnectionDB.restoreSingleton();
          console.log(
            "[INFO] CLOSED CONNECTION, CONNECTIONDB => %o",
            ConnectionDB.connectionInstance
          );
        } else {
          console.log(
            "[WARNING]CANNOT CLOSE CONNECTION OF INEXISTENT ATTRIBUTE, CONNECTIONDB => %o",
            ConnectionDB
          );
        }
      } else {
        ConnectionDB.concurrentCalleds--;
        if (ConnectionDB.concurrentCalleds === 1) {
          await ConnectionDB.closeConnection();
        }
      }
    } catch (error) {
      console.log("[ERROR]Error in closeConnection %o", error);
    }
  }

  public static restoreSingleton(): void {
    ConnectionDB.connectionInstance = null;
    ConnectionDB.concurrentCalleds = 0;
    ConnectionDB.connection = {} as Connection;
  }

  private static connectionInstance: ConnectionDB | null;
  private static connection: Connection;
  private static concurrentCalleds = 0;

  private static async runConnection(): Promise<Connection> {
    try {
      console.log(`[DB NEW CONNECTION]`);
      return await createConnection({
        acquireTimeout: Number(await getVariable("DATABASE_TIMEOUT")),
        connectTimeout: Number(await getVariable("DATABASE_TIMEOUT")),
        database: await getVariable("DB_NAME"),
        entities: [`${__dirname}/../../../**/*.entity{.ts,.js}`],
        extra: {
          connectionLimit: 300,
        },
        host: await getVariable("DB_HOST"),
        password: await getVariable("DB_PASSWORD"),
        port: +(await getVariable("DB_PORT")),
        synchronize: false,
        type: "mysql",
        username: await getVariable("DB_USER"),
      });
    } catch (error) {
      console.log(`[ERROR-DB] ${error}`);
      return Promise.reject({
        message: "Could not connect to DB",
        error: `${error}`,
      });
    }
  }
}
