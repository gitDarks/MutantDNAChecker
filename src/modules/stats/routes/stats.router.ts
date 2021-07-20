import { Request, Response, Router } from "express";
import { Stats } from "../controllers/stats.controller";

class StatsRouter {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    try {
      this.router.get("/stats", async (rq: Request, rs: Response) => {
        const stats = new Stats();
        rs.send("Stats are: " + await stats.getStats());
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const statsRouter = new StatsRouter();
export default statsRouter.router;
