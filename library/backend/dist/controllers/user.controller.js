"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const borrowed_1 = __importDefault(require("../models/borrowed"));
const user_1 = __importDefault(require("../models/user"));
class UserController {
    constructor() {
        this.allUsers = (req, res) => {
            user_1.default.find({ "type": { $ne: "admin" } }, (err, users) => {
                if (err)
                    console.log(err);
                else
                    return res.json(users);
            });
        };
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ "username": username, "password": password }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    if (user == null) {
                        user_1.default.findOne({ "username": username }, (err, user) => {
                            if (err)
                                console.log(err);
                            else if (user == null) {
                                return res.json({ message: "Incorrect username" });
                            }
                            else
                                return res.json({ message: "Incorrect password" });
                        });
                    }
                    else
                        res.json(user);
                }
            });
        };
        this.addUser = (req, res) => {
            let request = new user_1.default({
                username: req.body.username,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                image: req.body.image,
                type: req.body.type,
                status: "active",
            });
            request.save().then(user => {
                res.status(200).json({ message: "User succesfully added" });
            }).catch(err => {
                res.status(400).json({ message: "error" });
            });
        };
        this.checkavailability = (req, res) => {
            user_1.default.find({ $or: [{ "username": req.body.username }, { "email": req.body.email }] }, (err, user) => {
                if (err)
                    console.log(err);
                else if (user) {
                    res.json(user);
                }
            });
        };
        this.register = (req, res) => {
            let request = new user_1.default({
                username: req.body.username,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                image: req.body.image,
                type: req.body.type,
                status: "pending"
            });
            request.save().then(user => {
                res.status(200).json({ message: "Register request succesfully added" });
            }).catch(err => {
                res.status(400).json({ message: "error" });
            });
        };
        this.acceptRequest = (req, res) => {
            user_1.default.collection.updateOne({ "username": req.body.username }, { $set: { status: "active" } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "User succesfully added" });
            });
        };
        this.denyRequest = (req, res) => {
            user_1.default.collection.deleteOne({ username: req.body.username }, (err) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "User succesfully deleted" });
            });
        };
        this.changePassword = (req, res) => {
            user_1.default.collection.updateOne({ "username": req.body.username }, { $set: { password: req.body.newpassword } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Password update successful" });
            });
        };
        // change to moderator/reader
        this.updateType = (req, res) => {
            user_1.default.collection.updateOne({ "username": req.body.username }, { $set: { type: req.body.type } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Type update successful" });
            });
        };
        this.block = (req, res) => {
            user_1.default.collection.updateOne({ "username": req.body.username }, { $set: { status: "blocked" } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "User successfully blocked" });
            });
        };
        this.deblock = (req, res) => {
            user_1.default.collection.updateOne({ "username": req.body.username }, { $set: { status: "active" } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "User successfully unblocked" });
            });
        };
        this.delete = (req, res) => {
            borrowed_1.default.collection.deleteMany({ "username": req.body.username }, (err) => {
                if (err)
                    console.log(err);
                else {
                    user_1.default.collection.deleteOne({ "username": req.body.username }, (err) => {
                        if (err)
                            console.log(err);
                        else
                            return res.json({ message: "User succesfully deleted" });
                    });
                }
            });
        };
        this.updateInfo = (req, res) => {
            let username = req.body.username;
            let newusername = req.body.newusername;
            let password = req.body.password;
            let firstname = req.body.firstname;
            let lastname = req.body.lastname;
            let address = req.body.address;
            let phone = req.body.phone;
            let email = req.body.email;
            let image = req.body.image;
            if (newusername != null && username != newusername) {
                user_1.default.findOne({ "username": newusername }, (err, user) => {
                    if (err)
                        console.log(err);
                    else if (user != null) {
                        return res.json({ message: "Username already taken" });
                    }
                    else {
                        user_1.default.collection.updateOne({ "username": username }, { $set: { username: newusername } }, (err, user) => {
                            if (err) {
                                console.log(err);
                            }
                            else
                                username = newusername;
                        });
                    }
                });
            }
            if (email != null) {
                user_1.default.findOne({ "email": email }, (err, user) => {
                    if (err)
                        console.log(err);
                    else if (user != null) {
                        return res.json({ message: "Email already taken" });
                    }
                    else {
                        user_1.default.collection.updateOne({ "username": username }, { $set: { email: email } }, (err, user) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
            if (password != null) {
                user_1.default.collection.updateOne({ "username": username }, { $set: { password: password } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (firstname != null) {
                user_1.default.collection.updateOne({ "username": username }, { $set: { firstname: firstname } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (lastname != null) {
                user_1.default.collection.updateOne({ "username": username }, { $set: { lastname: lastname } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (address != null) {
                user_1.default.collection.updateOne({ "username": username }, { $set: { address: address } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (phone != null) {
                user_1.default.collection.updateOne({ "username": username }, { $set: { phone: phone } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (image != null) {
                user_1.default.collection.updateOne({ "username": username }, { $set: { image: image } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            res.json();
        };
        this.uploadFile = (req, res) => {
            // console.log("usao");
            //upload.single('file');
            res.json("good");
            //let file = req.body.file;
            /*let file = req['files'].photo;
            let username = req.body.username;
            console.log(file);
            console.log(file.name);*/
        };
        this.userInfo = (req, res) => {
            let username = req.body.username;
            user_1.default.findOne({ "username": username }, (err, user) => {
                if (err)
                    console.log(err);
                else
                    res.json(user);
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map