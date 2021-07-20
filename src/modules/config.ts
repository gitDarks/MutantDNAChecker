// import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

let envConfig: { [key: string]: string } = {};

export const config = async () => {
  // if (['production', 'stage', 'develop'].includes(process.env.NODE_ENV || '')) {
  //   try {
  //     const secret = await getAWSSecrets(process.env.DB_BM_SECRET_NAME || '');
  //     envConfig = getEnvVariables(secret);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // } else {
    envConfig = dotenv.parse(fs.readFileSync('.env'));
    console.log("envConfig: ", envConfig);
  // }
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
    throw new Error('failed to get variable');
  }
};

// const getAWSSecrets = async (SecretId: string): Promise<{ [key: string]: string }> => {
//   return new Promise((resolve, reject) => {
//     const client = new AWS.SecretsManager({
//       httpOptions: { timeout: 25000 },
//       region: 'us-east-1'
//     });
//     console.log(`Loading secret from AWS`);
//     client.getSecretValue({ SecretId }, (err, data) => {
//       if (err) {
//         console.log(`secret error: %j`, err);
//         reject(err);
//       } else {
//         resolve(JSON.parse(data.SecretString || '{}'));
//       }
//     });
//   });
// };

// const getEnvVariables = (secret: any) => {
//   return {
//     API_ENDPOINT: process.env.API_ENDPOINT || '',
//     API_KEY: process.env.API_KEY || '',
//     AUTH_ENDPOINT: process.env.AUTH_ENDPOINT || '',
//     DATABASE_TIMEOUT: process.env.DATABASE_TIMEOUT || '',
//     DB_HOST: secret.host,
//     DB_PASSWORD: secret.password,
//     DB_PORT: secret.port,
//     DB_SCHEMA: secret.schema_core,
//     DB_USER: secret.username,
//     MONITOR_PLUS_URL: process.env.MONITOR_PLUS_URL || '',
//     NOTIFICATIONS_URL: process.env.NOTIFICATIONS_URL || '',
//     PORT: process.env.PORT || '9702',
//     STATIC_FILE_VALIDATIONS: process.env.STATIC_FILE_VALIDATIONS || ''
//   };
// };

export { getVariable };
