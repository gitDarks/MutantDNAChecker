import express, { Request, Response } from "express";
import { DNAChecker } from "./modules/services/dna-checker.service";
import { Stats } from './modules/services/stats.service';

const PORT = process.env.PORT || 3050;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${PORT}`);
});

// routes
app.get("/health", (rq: Request, rs: Response) => {
  rs.send("API OK!");
});

// Check if DNA Sequence belongs to a mutant
app.post("/mutant", (rq: Request, rs: Response) => {
  console.log("---mutant---");
  // Leer secuencia de ADN desde el request
  const dnaSequence = rq.body.dna;
  const dnaChecker = new DNAChecker();
  const isMutant = dnaChecker.isMutant(dnaSequence);

  if (isMutant) {
    rs.status(200).send("200-OK");
  } else {
    rs.status(403).send("403-Forbidden  ");
  }
});

app.get("/stats", (rq: Request, rs: Response) => {
  rs.send("Stats are: " + Stats.getStats());
});
