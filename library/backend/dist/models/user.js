"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        street: {
            type: String
        },
        number: {
            type: Number
        },
        city: {
            type: String
        }
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    image: {
        type: String
    },
    type: {
        type: String // reader, moderator, admin
    },
    status: {
        type: String //pending active blocked
    }
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map