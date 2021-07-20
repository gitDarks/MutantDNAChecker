import express from "express";
import indexRouter from "./modules/core/routes/index.router";
import { ConnectionDB } from "./modules/core/services/db/db.service";
import mutantRouter from "./modules/dna-checker/routes/dna-checker.router";
import statsRouter from "./modules/stats/routes/stats.router";

const PORT = process.env.PORT || 3050;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${PORT}`);
});

app.use("/", indexRouter);
app.use("/", mutantRouter);
app.use("/", statsRouter);
app.use(async (req: any, res: any, next: any): Promise<void> => {
  try {
    await ConnectionDB.getConnectionInstance();
    return next();
  } catch (e) {
    return res.send(500, e.message);
  }
});
