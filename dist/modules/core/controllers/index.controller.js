"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexController {
    Health(rq, rs) {
        rs.status(200);
        rs.end('OK');
    }
}
const indexController = new IndexController();
exports.default = indexController;
//# sourceMappingURL=index.controller.js.map