"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Book = new Schema({
    id: {
        type: Number
    },
    title: {
        type: String
    },
    authors: [
        {
            firstname: {
                type: String
            },
            lastname: {
                type: String
            }
        }
    ],
    genres: [
        {
            type: String
        }
    ],
    publisher: {
        type: String
    },
    yearPublished: {
        type: Number
    },
    language: {
        type: String
    },
    image: {
        type: String
    },
    status: {
        type: String //pending active
    },
    username: {
        type: String // predlozio
    },
    quantity: {
        type: Number
    },
    days: {
        type: Number
    },
    comments: [
        {
            username: {
                type: String
            },
            comment: {
                type: String
            },
            review: {
                type: Number
            },
            date: {
                type: Date
            },
            edited: {
                type: Boolean
            }
        }
    ]
});
exports.default = mongoose_1.default.model('Book', Book, 'books');
//# sourceMappingURL=book.js.map