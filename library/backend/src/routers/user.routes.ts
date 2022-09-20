import express from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/allUsers').get((req,res)=> new UserController().allUsers(req,res));

userRouter.route('/login').post((req,res)=>new UserController().login(req,res));

userRouter.route('/register').post((req,res)=> new UserController().register(req,res));

userRouter.route('/addUser').post((req,res)=> new UserController().addUser(req,res));

userRouter.route('/acceptRequest').post((req,res)=> new UserController().acceptRequest(req,res));

userRouter.route('/denyRequest').post((req,res)=> new UserController().denyRequest(req,res));

userRouter.route('/changePassword').post((req,res)=> new UserController().changePassword(req,res));

userRouter.route('/updateType').post((req,res)=> new UserController().updateType(req,res));

userRouter.route('/block').post((req,res)=> new UserController().block(req,res));

userRouter.route('/deblock').post((req,res)=> new UserController().deblock(req,res));

userRouter.route('/delete').post((req,res)=> new UserController().delete(req,res));

userRouter.route('/updateInfo').post((req,res)=> new UserController().updateInfo(req,res));

userRouter.route('/checkavailability').post((req,res)=> new UserController().checkavailability(req,res));

userRouter.route('/uploadFile').post((req,res)=> new UserController().uploadFile(req,res));

userRouter.route('/userInfo').post((req,res)=> new UserController().userInfo(req,res));

export default userRouter;