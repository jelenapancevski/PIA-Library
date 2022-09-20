"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const borrowed_1 = __importDefault(require("../models/borrowed"));
const book_1 = __importDefault(require("../models/book"));
const genre_1 = __importDefault(require("../models/genre"));
const BookOfTheday_1 = __importDefault(require("../models/BookOfTheday"));
class BooksController {
    constructor() {
        this.allBooks = (req, res) => {
            book_1.default.find({}, (err, books) => {
                if (err)
                    console.log(err);
                else
                    res.json(books);
            });
        };
        this.allBorrowed = (req, res) => {
            borrowed_1.default.find({ dateReturned: null, dateTaken: { $ne: null } }, (err, books) => {
                if (err)
                    console.log(err);
                else
                    res.json(books);
            });
        };
        this.addBook = (req, res) => {
            let book = new book_1.default({
                id: req.body.id,
                title: req.body.title,
                authors: req.body.authors,
                genres: req.body.genres,
                publisher: req.body.publisher,
                yearPublished: req.body.yearPublished,
                language: req.body.language,
                image: req.body.image,
                status: "active",
                username: null,
                quantity: req.body.quantity,
                days: req.body.days,
                comments: []
            });
            book.save().then(book => {
                res.status(200).json({ message: "Book  succesfully added" });
            }).catch(err => {
                res.status(400).json({ message: "error" });
            });
        };
        this.requestBook = (req, res) => {
            let book = new book_1.default({
                id: req.body.id,
                title: req.body.title,
                authors: req.body.authors,
                genres: req.body.genres,
                publisher: req.body.publisher,
                yearPublished: req.body.yearPublished,
                language: req.body.language,
                image: req.body.image,
                status: "pending",
                username: req.body.username,
                quantity: 5,
                days: 14,
                comments: []
            });
            book.save().then(book => {
                res.status(200).json({ message: "Book request succesfully added" });
            }).catch(err => {
                res.status(400).json({ message: "error" });
            });
        };
        this.acceptRequest = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { status: "active" } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Book succesfully added" });
            });
        };
        this.denyRequest = (req, res) => {
            book_1.default.deleteOne({ id: parseInt(req.body.id) }, (err) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Book succesfully deleted" });
            });
        };
        this.getRequests = (req, res) => {
            book_1.default.find({ status: "pending" }, (err, books) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json(books);
            });
        };
        this.setDays = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { days: parseInt(req.body.days) } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Days succesfully updated" });
            });
        };
        this.search = (req, res) => {
            let title = req.body.title;
            let first = req.body.firstnames;
            let last = req.body.lastnames;
            let authors = req.body.authors;
            if (title != null && (authors == null)) {
                //search by title
                book_1.default.find({ "title": { $regex: new RegExp(title, "i") }, "status": "active" }, (err, books) => {
                    if (err)
                        console.log(err);
                    else
                        return res.json(books);
                });
            }
            else if (title != null && (authors != null)) {
                //search by title and authors
                let firstnamesp = first.split(" ");
                let lastnamesp = last.split(" ");
                let firstnames = [];
                let lastnames = [];
                for (let f of firstnamesp) {
                    if (f != "")
                        firstnames.push(new RegExp(f, "i"));
                }
                for (let l of lastnamesp) {
                    if (l != "")
                        lastnames.push(new RegExp(l, "i"));
                }
                //console.log(lastnames);
                book_1.default.find({ "title": { $regex: new RegExp(title, "i") }, "status": "active" }).find({ $or: [{ "authors.firstname": { $in: firstnames } }, { "authors.lastname": { $in: lastnames } }] }, (err, books) => {
                    if (err)
                        console.log(err);
                    else
                        return res.json(books);
                });
            }
            else if (authors != null) {
                // search by authors
                //console.log("ovde");
                let firstnamesp = first.split(" ");
                let lastnamesp = last.split(" ");
                let firstnames = [];
                let lastnames = [];
                for (let f of firstnamesp) {
                    if (f != "")
                        firstnames.push(new RegExp(f));
                }
                for (let l of lastnamesp) {
                    if (l != "")
                        lastnames.push(new RegExp(l));
                }
                book_1.default.find({ "status": "active" }).find({ $or: [{ "authors.firstname": { $in: firstnames } }, { "authors.lastname": { $in: lastnames } }] }, (err, books) => {
                    if (err)
                        console.log(err);
                    else
                        return res.json(books);
                });
            }
        };
        this.borrow = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let dateTaken = req.body.dateTaken;
            let days = req.body.days;
            let dateReturned = null;
            borrowed_1.default.collection.insertOne({ "id": bookId, "username": username, "dateTaken": new Date(dateTaken), "dateReturned": dateReturned, "days": days, "reservation": false }, (err, borrows) => {
                if (err)
                    console.log(err);
                else {
                    book_1.default.updateOne({ "id": bookId }, { $inc: { "quantity": -1 } }, (err, ok) => {
                        if (err)
                            console.log(err);
                        else
                            return res.json({ "message": "Succesfully borrowed book" });
                    });
                }
            });
        };
        this.autoborrow = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let dateTaken = req.body.dateTaken;
            borrowed_1.default.collection.updateOne({ "id": bookId, "username": username, "dateTaken": null }, { $set: { "dateTaken": new Date(dateTaken) } }, (err, borrows) => {
                if (err)
                    console.log(err);
                else
                    return res.json({ "message": "Succesfully borrowed book" });
            });
        };
        this.reserve = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let dateTaken = null;
            let days = req.body.days;
            let dateReturned = null;
            borrowed_1.default.collection.insertOne({ "id": bookId, "username": username, "dateTaken": dateTaken, "dateReturned": dateReturned, "days": days, "reservation": false }, (err, borrows) => {
                if (err)
                    console.log(err);
                else
                    return res.json({ "message": "Succesfully reserved book" });
            });
        };
        this.returnbook = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let dateTaken = req.body.dateTaken;
            let dateReturned = req.body.dateReturned;
            borrowed_1.default.collection.updateOne({ "id": bookId, "username": username, "dateTaken": new Date(dateTaken) }, { $set: { "dateReturned": new Date(dateReturned) } }, (err, borrows) => {
                if (err)
                    console.log(err);
                else {
                    // pronadji ako ima da rezervacija
                    borrowed_1.default.find({ "id": bookId, 'dateTaken': null, 'dateReturned': null }, (err, reservations) => {
                        if (err)
                            console.log(err);
                        else {
                            if (reservations.length > 0) {
                                borrowed_1.default.find({ dateReturned: null, dateTaken: { $ne: null } }, (err, borrowed) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        for (let reservation of reservations) {
                                            let count = 0;
                                            let notlate = true;
                                            for (let b of borrowed) {
                                                if (b.toObject().username == reservation.toObject().username) {
                                                    if (this.Isoverdue(b.toObject().dateTaken, b.toObject().days))
                                                        notlate = false;
                                                    count++;
                                                }
                                                if (count == 3 || notlate == false)
                                                    break;
                                            }
                                            if (count < 3 && notlate) {
                                                //reservation found
                                                borrowed_1.default.updateOne({ "id": (reservation.toObject()).id, "username": (reservation.toObject()).username, "dateTaken": null }, { $set: { "dateTaken": new Date(), "reservation": true } }, (err, retval) => {
                                                    if (err)
                                                        console.log(err);
                                                    else {
                                                        return res.json({ "message": "Succesfully borrowed book" });
                                                    }
                                                });
                                            }
                                            else {
                                                book_1.default.updateOne({ "id": bookId }, { $inc: { "quantity": 1 } }, (err, ok) => {
                                                    if (err)
                                                        console.log(err);
                                                    else
                                                        return res.json({ "message": "Succesfully returned book" });
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                            else {
                                book_1.default.updateOne({ "id": bookId }, { $inc: { "quantity": 1 } }, (err, ok) => {
                                    if (err)
                                        console.log(err);
                                    else
                                        return res.json({ "message": "Succesfully returned book" });
                                });
                            }
                        }
                    });
                }
            });
        };
        this.comment = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let comment = req.body.comment;
            let review = req.body.review;
            let date = req.body.date;
            let edited = false;
            book_1.default.collection.updateOne({ "id": bookId }, {
                $push: {
                    "comments": {
                        "username": username,
                        "comment": comment,
                        "review": parseInt(review),
                        "date": new Date(date),
                        "edited": edited
                    }
                }
            }, (err, book) => {
                if (err)
                    console.log(err);
                else
                    return res.json({ "message": "Added comment" });
            });
        };
        this.editcom = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let comment = req.body.comment;
            let edited = true;
            book_1.default.collection.updateOne({ "id": bookId, "comments.username": username }, {
                $set: {
                    "comments.$.comment": comment,
                    "comments.$.edited": edited
                }
            }, (err, book) => {
                if (err)
                    console.log(err);
                else
                    return res.json({ "message": "Updated comment" });
            });
        };
        this.updateTitle = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { title: req.body.title } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Title succesfully updated" });
            });
        };
        this.updateAuthors = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { authors: req.body.authors } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Authors succesfully updated" });
            });
        };
        this.updateGenre = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { genres: req.body.genres } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Genres succesfully updated" });
            });
        };
        this.updatePublisher = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { publisher: req.body.publisher } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "Publisher succesfully updated" });
            });
        };
        this.updateYearPublished = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { yearPublished: parseInt(req.body.yearPublished) } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "yearPublished succesfully updated" });
            });
        };
        this.updateLanguage = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { language: req.body.language } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "language succesfully updated" });
            });
        };
        this.updateImage = (req, res) => {
            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { image: req.body.image } }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else
                    return res.json({ message: "image succesfully updated" });
            });
        };
        this.updateQuantity = (req, res) => {
            let quantity = parseInt(req.body.quantity);
            if (quantity > 0) {
                // pronadji ako ima da rezervacija
                borrowed_1.default.find({ "id": parseInt(req.body.id), 'dateTaken': null, 'dateReturned': null }, (err, reservations) => {
                    if (err)
                        console.log(err);
                    else {
                        if (reservations.length > 0) {
                            borrowed_1.default.find({ dateReturned: null, dateTaken: { $ne: null } }, (err, borrowed) => {
                                if (err)
                                    console.log(err);
                                else {
                                    let rez = [];
                                    for (let reservation of reservations) {
                                        let count = 0;
                                        let notlate = true;
                                        for (let b of borrowed) {
                                            if (b.toObject().username == reservation.toObject().username) {
                                                if (this.Isoverdue(b.toObject().dateTaken, b.toObject().days))
                                                    notlate = false;
                                                count++;
                                            }
                                            if (count == 3 || notlate == false)
                                                break;
                                        }
                                        if (count < 3 && notlate && quantity > 0) {
                                            //reservation found
                                            rez.push(reservation.toObject().username);
                                            quantity--;
                                        }
                                        if (quantity == 0)
                                            break;
                                    }
                                    borrowed_1.default.collection.updateMany({ "id": parseInt(req.body.id), "username": { $in: rez }, "dateTaken": null }, { $set: { "dateTaken": new Date(), "reservation": true } }, (err, retval) => {
                                        if (err)
                                            console.log(err);
                                    });
                                    book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { quantity: quantity } }, (err, user) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            return res.json({ message: "quantity succesfully updated" });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { quantity: parseInt(req.body.quantity) } }, (err, user) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    return res.json({ message: "quantity succesfully updated" });
                                }
                            });
                        }
                    }
                });
            }
            else {
                book_1.default.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { quantity: parseInt(req.body.quantity) } }, (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        return res.json({ message: "quantity succesfully updated" });
                    }
                });
            }
        };
        this.delete = (req, res) => {
            borrowed_1.default.collection.deleteMany({ "id": parseInt(req.body.id) }, (err) => {
                if (err)
                    console.log(err);
                else {
                    book_1.default.collection.deleteOne({ "id": parseInt(req.body.id) }, (err) => {
                        if (err)
                            console.log(err);
                        else
                            return res.json({ message: "Book succesfully deleted" });
                    });
                }
            });
        };
        this.topThree = (req, res) => {
            borrowed_1.default.collection.aggregate([
                {
                    $group: {
                        _id: '$id',
                        count: { $sum: 1 }
                    },
                }, { $sort: { count: -1 } }
            ]).toArray((err, result) => {
                if (err)
                    console.log(err);
                else
                    return res.send(result);
            });
        };
        this.genre = (req, res) => {
            genre_1.default.find({}, (err, genres) => {
                if (err)
                    console.log(err);
                else
                    return res.json(genres);
            });
        };
        this.borrows = (req, res) => {
            let username = req.body.username;
            borrowed_1.default.find({ "username": username }, (err, borrows) => {
                if (err)
                    console.log(err);
                else
                    return res.json(borrows);
            });
        };
        this.suggested = (req, res) => {
            let username = req.body.username;
            book_1.default.find({ "username": username }, (err, books) => {
                if (err)
                    console.log(err);
                else
                    return res.json(books);
            });
        };
        this.bookInfo = (req, res) => {
            let id = req.body.id;
            book_1.default.findOne({ "id": parseInt(id) }, (err, book) => {
                if (err)
                    console.log(err);
                else
                    return res.json(book);
            });
        };
        this.extend = (req, res) => {
            let bookId = req.body.bookId;
            let username = req.body.username;
            let days = parseInt(req.body.days);
            borrowed_1.default.collection.updateOne({ "id": bookId, "username": username, "dateReturned": null }, { $inc: { "days": days } }, (err, book) => {
                if (err)
                    console.log(err);
                else
                    return res.json(book);
            });
        };
        this.bookOfTheDay = (req, res) => {
            BookOfTheday_1.default.findOne({}, (err, book) => {
                if (err)
                    console.log(err);
                else {
                    if (book) {
                        let bookoftheday = book.toObject();
                        let today = new Date();
                        let bookday = new Date(bookoftheday.date);
                        if (bookday.getDate() == today.getDate() && bookday.getMonth() == today.getMonth() && bookday.getFullYear() == today.getFullYear()) {
                            book_1.default.findOne({ "id": book.id }, (err, book) => {
                                if (err)
                                    console.log(err);
                                else
                                    res.json(book);
                            });
                        }
                        else {
                            // change book of the day
                            book_1.default.estimatedDocumentCount((err, number) => {
                                if (err)
                                    console.log(err);
                                else {
                                    book_1.default.find({ "status": "pending" }, (err, reqbooks) => {
                                        if (err)
                                            console.log(err);
                                        else {
                                            let requests = reqbooks;
                                            let ids = [];
                                            for (let req of requests) {
                                                ids.push(req.toObject().id);
                                            }
                                            let found = false;
                                            let min = 0;
                                            let max = number - 1;
                                            let index = Math.floor(Math.random() * (max - min) + min);
                                            while (!found) {
                                                if (!ids.includes(index)) {
                                                    found = true;
                                                    break;
                                                }
                                                index = Math.floor(Math.random() * (max - min) + min);
                                            }
                                            book_1.default.findOne({ "id": index }, (err, book) => {
                                                if (err)
                                                    console.log(err);
                                                else {
                                                    BookOfTheday_1.default.deleteOne({}, (err) => {
                                                        if (err)
                                                            console.log(err);
                                                        else {
                                                            BookOfTheday_1.default.collection.insertOne({ "id": index, "date": today }, (err, retval) => {
                                                                if (err)
                                                                    console.log(err);
                                                                else
                                                                    res.json(book);
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        //create book of the day
                        book_1.default.estimatedDocumentCount((err, number) => {
                            if (err)
                                console.log(err);
                            else {
                                book_1.default.find({ "status": "pending" }, (err, reqbooks) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        let requests = reqbooks;
                                        let ids = [];
                                        for (let req of requests) {
                                            ids.push(req.toObject().id);
                                        }
                                        let found = false;
                                        let min = 0;
                                        let max = number - 1;
                                        let index = Math.floor(Math.random() * (max - min) + min);
                                        while (!found) {
                                            if (!ids.includes(index)) {
                                                found = true;
                                                break;
                                            }
                                            index = Math.floor(Math.random() * (max - min) + min);
                                        }
                                        book_1.default.findOne({ "id": index }, (err, book) => {
                                            if (err)
                                                console.log(err);
                                            else {
                                                let booktet = book;
                                                let today = new Date();
                                                BookOfTheday_1.default.collection.insertOne({ "id": index, "date": today }, (err, retval) => {
                                                    if (err)
                                                        console.log(err);
                                                    else
                                                        res.json(booktet);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        };
        this.borrowedBooks = (req, res) => {
            let username = req.body.username;
            borrowed_1.default.collection.aggregate([{
                    $lookup: {
                        from: "books",
                        localField: "id",
                        foreignField: "id",
                        as: "booksborrowed"
                    }
                }]).toArray((err, result) => {
                if (err)
                    console.log(err);
                else {
                    res.json(result);
                }
            });
        };
        this.monthlyBooks = (req, res) => {
            let username = req.body.username;
            let today = new Date();
            let lastyear = new Date();
            lastyear.setFullYear(lastyear.getFullYear() - 1);
            borrowed_1.default.find({ "username": username, "dateTaken": { "$gte": lastyear, "$lte": today } }, (err, borrowed) => {
                if (err)
                    console.log(err);
                else
                    res.json(borrowed);
            });
        };
        this.notificationSent = (req, res) => {
            let ids = req.body.ids;
            let username = req.body.username;
            borrowed_1.default.updateMany({ "username": username, "id": { $in: ids } }, { "reservation": false }, (err, call) => {
                if (err)
                    console.log(err);
            });
        };
    }
    Isoverdue(date, days) {
        let LastDay = new Date(date);
        LastDay.setDate(LastDay.getDate() + days);
        let today = new Date();
        if (LastDay < today)
            return true;
        else
            return false;
    }
}
exports.BooksController = BooksController;
//# sourceMappingURL=books.controller.js.map