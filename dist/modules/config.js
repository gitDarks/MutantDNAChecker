"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getVariable = exports.config = void 0;
// import AWS from 'aws-sdk';
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
let envConfig = {};
const config = () => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.config = config;
const getVariable = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!Object.keys(envConfig).length) {
            yield exports.config();
        }
        return envConfig[key];
    }
    catch (err) {
        console.log(`config error: %j`, err);
        throw new Error('failed to get variable');
    }
});
exports.getVariable = getVariable;
//# sourceMappingURL=config.js.map