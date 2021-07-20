import { Router } from "express";
import indexCoreController from "../controllers/index.controller";

class IndexRouter {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/health", indexCoreController.Health);
  }
}

const indexRouter = new IndexRouter();
export default indexRouter.router;
