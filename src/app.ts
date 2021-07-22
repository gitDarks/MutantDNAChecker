import express from "express";
import indexRouter from "./modules/core/routes/index.router";
import { ConnectionDB } from "./modules/core/services/db/db.service";
import mutantRouter from "./modules/dna-checker/routes/dna-checker.router";
import statsRouter from "./modules/stats/routes/stats.router";

const PORT = process.env.PORT || 3050;

const app = express();

app.use(express.json());
const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
if (!isInLambda) {
  app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${PORT}`);
  });
}

app.use("/", indexRouter);
app.use("/", mutantRouter);
app.use("/", statsRouter);

// app.use(async (req: any, res: any, next: any): Promise<void> => {
//   try {
//     await ConnectionDB.getConnectionInstance();
//     return next();
//   } catch (e) {
//     return res.send(500, e.message);
//   }
// });

app.use((err: any, req: any, res: any, next: any) => {
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

export default app;
