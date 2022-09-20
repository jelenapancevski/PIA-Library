"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route('/allUsers').get((req, res) => new user_controller_1.UserController().allUsers(req, res));
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/register').post((req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route('/addUser').post((req, res) => new user_controller_1.UserController().addUser(req, res));
userRouter.route('/acceptRequest').post((req, res) => new user_controller_1.UserController().acceptRequest(req, res));
userRouter.route('/denyRequest').post((req, res) => new user_controller_1.UserController().denyRequest(req, res));
userRouter.route('/changePassword').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/updateType').post((req, res) => new user_controller_1.UserController().updateType(req, res));
userRouter.route('/block').post((req, res) => new user_controller_1.UserController().block(req, res));
userRouter.route('/deblock').post((req, res) => new user_controller_1.UserController().deblock(req, res));
userRouter.route('/delete').post((req, res) => new user_controller_1.UserController().delete(req, res));
userRouter.route('/updateInfo').post((req, res) => new user_controller_1.UserController().updateInfo(req, res));
userRouter.route('/checkavailability').post((req, res) => new user_controller_1.UserController().checkavailability(req, res));
userRouter.route('/uploadFile').post((req, res) => new user_controller_1.UserController().uploadFile(req, res));
userRouter.route('/userInfo').post((req, res) => new user_controller_1.UserController().userInfo(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map