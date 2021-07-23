import { Router } from "express";
import dNACheckerController from '../controllers/dna-checker.controller';

class MutantRouter {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    try {
      this.router.post("/mutant", dNACheckerController.checkisMutant);
    } catch (error) {
      console.log(error);
    }
  }
}

const mutantRouter = new MutantRouter();
export default mutantRouter.router;
