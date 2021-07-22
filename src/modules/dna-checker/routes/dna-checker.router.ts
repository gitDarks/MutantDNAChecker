import { Request, Response, Router } from "express";
import { DNAChecker } from "../controllers/dna-checker.controller";

class MutantRouter {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    try {
      this.router.post("/mutant", async (rq: Request, rs: Response) => {
        // Leer secuencia de ADN desde el request
        const dnaSequence = rq.body.dna;
        const dnaChecker = new DNAChecker();
        const isMutant = await dnaChecker.isMutant(dnaSequence);
        // almacenar en BD
        dnaChecker.saveDNASequence(
          dnaSequence.toString(),
          isMutant ? "M" : "H"
        );

        if (isMutant) {
          rs.status(200).send("200-OK");
        } else {
          rs.status(403).send("403-Forbidden  ");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const mutantRouter = new MutantRouter();
export default mutantRouter.router;
