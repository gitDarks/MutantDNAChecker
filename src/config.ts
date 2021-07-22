import * as dotenv from "dotenv";
import * as fs from "fs";

let envConfig: { [key: string]: string } = {};

export const config = async () => {
  const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
  if (isInLambda) {
    try {
      envConfig = getEnvVariables();
    } catch (error) {
      console.log("Error reading env vars: ", error);
      return Promise.reject(error);
    }
  } else {
    envConfig = dotenv.parse(fs.readFileSync(".env"));
  }
  return Promise.resolve(true);
};

const getVariable = async (key: string): Promise<string> => {
  try {
    if (!Object.keys(envConfig).length) {
      await config();
    }
    return envConfig[key];
  } catch (err) {
    console.log(`config error: %j`, err);
    throw new Error("failed to get variable");
  }
};

const getEnvVariables = () => {
  return {
    DATABASE_TIMEOUT: process.env.DATABASE_TIMEOUT || "",
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT || "3306",
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
  };
};

export { getVariable };
