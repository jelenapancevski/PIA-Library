"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Borrowed = new Schema({
    id: {
        type: Number
    },
    username: {
        type: String
    },
    dateTaken: {
        type: Date //  null if reservation ,  not null if borrowed/ returned
    },
    dateReturned: {
        type: Date //null if reservation/borrowed not null if returned
    },
    days: {
        type: Number
    },
    reservation: {
        type: Boolean
    }
});
exports.default = mongoose_1.default.model('Borrowed', Borrowed, 'borrowed');
//# sourceMappingURL=borrowed.js.map