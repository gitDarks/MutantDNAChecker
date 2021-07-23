import { Router } from "express";
import statsController from "../controllers/stats.controller";

class StatsRouter {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    try {
      this.router.get("/stats", statsController.getStats);
    } catch (error) {
      console.log(error);
    }
  }
}

const statsRouter = new StatsRouter();
export default statsRouter.router;
