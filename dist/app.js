"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_router_1 = __importDefault(require("./modules/core/routes/index.router"));
const dna_checker_router_1 = __importDefault(require("./modules/dna-checker/routes/dna-checker.router"));
const stats_router_1 = __importDefault(require("./modules/stats/routes/stats.router"));
const PORT = process.env.PORT || 3050;
const app = express_1.default();
app.use(express_1.default.json());
const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
if (!isInLambda) {
    app.listen(PORT, () => {
        // tslint:disable-next-line:no-console
        console.log(`server started at http://localhost:${PORT}`);
    });
}
app.use("/", index_router_1.default);
app.use("/", dna_checker_router_1.default);
app.use("/", stats_router_1.default);
// app.use(async (req: any, res: any, next: any): Promise<void> => {
//   try {
//     await ConnectionDB.getConnectionInstance();
//     return next();
//   } catch (e) {
//     return res.send(500, e.message);
//   }
// });
app.use((err, req, res, next) => {
    const statusCode = err.statusCode;
    res.status(statusCode).json({
        error: {
            data: err.data,
            message: err.message,
            name: err.name,
        },
    });
});
app.use((req, res) => {
    return res.status(404).send({ message: "Route " + req.url + " Not found." });
});
exports.default = app;
//# sourceMappingURL=app.js.map