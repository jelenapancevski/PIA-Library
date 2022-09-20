"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Genre = new Schema({
    /*id:{
        type:Number
    },*/ //autoincremented
    name: {
        type: String
    }
});
exports.default = mongoose_1.default.model('Genre', Genre, 'genre');
//# sourceMappingURL=genre.js.map