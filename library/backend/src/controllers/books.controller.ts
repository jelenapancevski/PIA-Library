import * as express from 'express';
import Borrowed from '../models/borrowed';
import Book from '../models/book';
import Genre from '../models/genre';
import BookOfTheday from '../models/BookOfTheday';
import book from '../models/book';


export class BooksController {
    allBooks = (req: express.Request, res: express.Response) => {
        Book.find({}, (err, books) => {
            if (err) console.log(err);
            else res.json(books);
        })
    }
    allBorrowed = (req: express.Request, res: express.Response) => {
        Borrowed.find({ dateReturned: null, dateTaken: { $ne: null } }, (err, books) => {
            if (err) console.log(err);
            else res.json(books);
        })
    }
    addBook = (req: express.Request, res: express.Response) => {
        let book = new Book({
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
        }
        ).catch(err => {
            res.status(400).json({ message: "error" })
        })

    }
    requestBook = (req: express.Request, res: express.Response) => {
        let book = new Book({
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
        }
        ).catch(err => {
            res.status(400).json({ message: "error" })
        })
    }


    acceptRequest = (req: express.Request, res: express.Response) => {

        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { status: "active" } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "Book succesfully added" });
        });
    }

    denyRequest = (req: express.Request, res: express.Response) => {

        Book.deleteOne({ id: parseInt(req.body.id) }, (err) => {
            if (err) {
                console.log(err);
            }
            else return res.json({ message: "Book succesfully deleted" });
        });

    }

    getRequests = (req: express.Request, res: express.Response) => {

        Book.find({ status: "pending" }, (err, books) => {
            if (err) {
                console.log(err);
            }
            else return res.json(books);
        });

    }
    setDays = (req: express.Request, res: express.Response) => {

        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { days: parseInt(req.body.days) } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "Days succesfully updated" });
        });

    }

    search = (req: express.Request, res: express.Response) => {
        let title = req.body.title;
        let first = req.body.firstnames;
        let last = req.body.lastnames;
        let authors = req.body.authors;

        if (title != null && (authors == null)) {
            //search by title
            Book.find({ "title": { $regex: new RegExp(title, "i") }, "status": "active" }, (err, books) => {
                if (err) console.log(err);
                else return res.json(books);

            })
        }
        else
            if (title != null && (authors != null)) {
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
                    if (l != "") lastnames.push(new RegExp(l, "i"));
                }
                //console.log(lastnames);

                Book.find({ "title": { $regex: new RegExp(title, "i") }, "status": "active" }).find({ $or: [{ "authors.firstname": { $in: firstnames } }, { "authors.lastname": { $in: lastnames } }] }, (err, books) => {
                    if (err) console.log(err);
                    else return res.json(books);
                })

            }
            else if (authors != null) {
                // search by authors
                //console.log("ovde");
                let firstnamesp = first.split(" ");
                let lastnamesp = last.split(" ");
                let firstnames = [];
                let lastnames = [];
                for (let f of firstnamesp) {
                    if (f != "") firstnames.push(new RegExp(f));
                }

                for (let l of lastnamesp) {
                    if (l != "") lastnames.push(new RegExp(l));
                }

                Book.find({ "status": "active" }).find({ $or: [{ "authors.firstname": { $in: firstnames } }, { "authors.lastname": { $in: lastnames } }] }, (err, books) => {
                    if (err) console.log(err);
                    else return res.json(books);

                })
            }

    }

    borrow = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let dateTaken = req.body.dateTaken;
        let days = req.body.days;
        let dateReturned = null;
        Borrowed.collection.insertOne({ "id": bookId, "username": username, "dateTaken": new Date(dateTaken), "dateReturned": dateReturned, "days": days, "reservation": false }, (err, borrows) => {
            if (err) console.log(err);
            else {
                Book.updateOne({ "id": bookId }, { $inc: { "quantity": -1 } }, (err, ok) => {
                    if (err) console.log(err);
                    else return res.json({ "message": "Succesfully borrowed book" });
                })


            }
        })

    }

    autoborrow = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let dateTaken = req.body.dateTaken;
        Borrowed.collection.updateOne({ "id": bookId, "username": username, "dateTaken": null }, { $set: { "dateTaken": new Date(dateTaken) } }, (err, borrows) => {
            if (err) console.log(err);
            else return res.json({ "message": "Succesfully borrowed book" });
        })

    }

    reserve = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let dateTaken = null;
        let days = req.body.days;
        let dateReturned = null;
        Borrowed.collection.insertOne({ "id": bookId, "username": username, "dateTaken": dateTaken, "dateReturned": dateReturned, "days": days, "reservation": false }, (err, borrows) => {
            if (err) console.log(err);
            else return res.json({ "message": "Succesfully reserved book" });
        })

    }
    Isoverdue(date: Date, days: number) {
        let LastDay = new Date(date);
        LastDay.setDate(LastDay.getDate() + days);
        let today = new Date();
        if (LastDay < today) return true;
        else return false;

    }

    returnbook = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let dateTaken = req.body.dateTaken;
        let dateReturned = req.body.dateReturned;
        Borrowed.collection.updateOne({ "id": bookId, "username": username, "dateTaken": new Date(dateTaken) }, { $set: { "dateReturned": new Date(dateReturned) } }, (err, borrows) => {
            if (err) console.log(err);
            else {
                // pronadji ako ima da rezervacija
                Borrowed.find({ "id": bookId, 'dateTaken': null, 'dateReturned': null }, (err, reservations) => {
                    if (err) console.log(err);
                    else {

                        if (reservations.length > 0) {

                            Borrowed.find({ dateReturned: null, dateTaken: { $ne: null } }, (err, borrowed) => {
                                if (err) console.log(err);
                                else {
                                    for (let reservation of reservations) {
                                        let count = 0;
                                        let notlate = true;
                                        for (let b of borrowed) {
                                            if (b.toObject().username == reservation.toObject().username) {
                                                if (this.Isoverdue(b.toObject().dateTaken, b.toObject().days)) notlate = false;
                                                count++;
                                            }
                                            if (count == 3 || notlate == false) break;

                                        }
                                        if (count < 3 && notlate) {
                                            //reservation found
                                            Borrowed.updateOne({ "id": (reservation.toObject()).id, "username": (reservation.toObject()).username, "dateTaken": null }, { $set: { "dateTaken": new Date(), "reservation": true } }, (err, retval) => {
                                                if (err) console.log(err);
                                                else {

                                                    return res.json({ "message": "Succesfully borrowed book" });

                                                }
                                            })
                                        }
                                        else {
                                            Book.updateOne({ "id": bookId }, { $inc: { "quantity": 1 } }, (err, ok) => {
                                                if (err) console.log(err);
                                                else return res.json({ "message": "Succesfully returned book" });
                                            })
                                        }
                                    }
                                }
                            })

                        } else {
                            Book.updateOne({ "id": bookId }, { $inc: { "quantity": 1 } }, (err, ok) => {
                                if (err) console.log(err);
                                else return res.json({ "message": "Succesfully returned book" });
                            })
                        }
                    }
                })

            }
        })

    }

    comment = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let comment = req.body.comment;
        let review = req.body.review;
        let date = req.body.date;
        let edited = false;


        Book.collection.updateOne({ "id": bookId }, {
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
            if (err) console.log(err);
            else return res.json({ "message": "Added comment" });
        })

    }
    editcom = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let comment = req.body.comment;
        let edited = true;

        Book.collection.updateOne({ "id": bookId, "comments.username": username }, {
            $set: {
                "comments.$.comment": comment,
                "comments.$.edited": edited
            }
        }, (err, book) => {
            if (err) console.log(err);
            else return res.json({ "message": "Updated comment" });
        })

    }

    updateTitle = (req: express.Request, res: express.Response) => {

        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { title: req.body.title } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "Title succesfully updated" });
        });
    }

    updateAuthors = (req: express.Request, res: express.Response) => {
        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { authors: req.body.authors } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "Authors succesfully updated" });
        });
    }

    updateGenre = (req: express.Request, res: express.Response) => {
        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { genres: req.body.genres } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "Genres succesfully updated" });
        });
    }

    updatePublisher = (req: express.Request, res: express.Response) => {
        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { publisher: req.body.publisher } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "Publisher succesfully updated" });
        });
    }

    updateYearPublished = (req: express.Request, res: express.Response) => {
        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { yearPublished: parseInt(req.body.yearPublished) } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "yearPublished succesfully updated" });
        });
    }
    updateLanguage = (req: express.Request, res: express.Response) => {
        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { language: req.body.language } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "language succesfully updated" });
        });
    }
    updateImage = (req: express.Request, res: express.Response) => {
        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { image: req.body.image } }, (err, user) => {
            if (err) {
                console.log(err);

            }
            else return res.json({ message: "image succesfully updated" });
        });
    }

    updateQuantity = (req: express.Request, res: express.Response) => {
        let quantity = parseInt(req.body.quantity);
        if (quantity > 0) {

            // pronadji ako ima da rezervacija
            Borrowed.find({ "id": parseInt(req.body.id), 'dateTaken': null, 'dateReturned': null }, (err, reservations) => {
                if (err) console.log(err);
                else {

                    if (reservations.length > 0) {
                        Borrowed.find({ dateReturned: null, dateTaken: { $ne: null } }, (err, borrowed) => {
                            if (err) console.log(err);
                            else {
                                let rez = [];

                                for (let reservation of reservations) {
                                    let count = 0;
                                    let notlate = true;

                                    for (let b of borrowed) {
                                        if (b.toObject().username == reservation.toObject().username) {
                                            if (this.Isoverdue(b.toObject().dateTaken, b.toObject().days)) notlate = false;
                                            count++;
                                        }
                                        if (count == 3 || notlate == false) break;

                                    }
                                    if (count < 3 && notlate && quantity > 0) {
                                        //reservation found
                                        rez.push(reservation.toObject().username);
                                        quantity--;
                                    }
                                    if (quantity == 0) break;
                                }

                                Borrowed.collection.updateMany({ "id": parseInt(req.body.id), "username": { $in: rez }, "dateTaken": null }, { $set: { "dateTaken": new Date(), "reservation": true } }, (err, retval) => {
                                    if (err) console.log(err);
                                })


                                Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { quantity: quantity } }, (err, user) => {
                                    if (err) {
                                        console.log(err);

                                    }
                                    else {
                                        return res.json({ message: "quantity succesfully updated" });
                                    }
                                });
                            }
                        })

                    } else {
                        Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { quantity: parseInt(req.body.quantity) } }, (err, user) => {
                            if (err) {
                                console.log(err);

                            }
                            else {
                                return res.json({ message: "quantity succesfully updated" });
                            }
                        });

                    }
                }
            })

        } else {
            Book.collection.updateOne({ "id": parseInt(req.body.id) }, { $set: { quantity: parseInt(req.body.quantity) } }, (err, user) => {
                if (err) {
                    console.log(err);

                }
                else {
                    return res.json({ message: "quantity succesfully updated" });
                }
            });
        }

    }

    delete = (req: express.Request, res: express.Response) => {
        Borrowed.collection.deleteMany({ "id": parseInt(req.body.id) }, (err) => {
            if (err) console.log(err);
            else {
                Book.collection.deleteOne({ "id": parseInt(req.body.id) }, (err) => {
                    if (err) console.log(err);
                    else return res.json({ message: "Book succesfully deleted" });
                });
            }
        })

    }

    topThree = (req: express.Request, res: express.Response) => {
        Borrowed.collection.aggregate([
            {
                $group: {
                    _id: '$id',
                    count: { $sum: 1 }

                },

            }, { $sort: { count: -1 } }
        ]).toArray((err, result) => {
            if (err) console.log(err);
            else return res.send(result);
        });
    }

    genre = (req: express.Request, res: express.Response) => {
        Genre.find({}, (err, genres) => {
            if (err) console.log(err);
            else return res.json(genres);
        })
    }

    borrows = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        Borrowed.find({ "username": username }, (err, borrows) => {
            if (err) console.log(err);
            else return res.json(borrows);
        })
    }

    suggested = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        Book.find({ "username": username }, (err, books) => {
            if (err) console.log(err);
            else return res.json(books);
        })
    }

    bookInfo = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        Book.findOne({ "id": parseInt(id) }, (err, book) => {
            if (err) console.log(err);
            else return res.json(book);
        })
    }

    extend = (req: express.Request, res: express.Response) => {
        let bookId = req.body.bookId;
        let username = req.body.username;
        let days = parseInt(req.body.days);
        Borrowed.collection.updateOne({ "id": bookId, "username": username, "dateReturned": null }, { $inc: { "days": days } }, (err, book) => {
            if (err) console.log(err);
            else return res.json(book);
        })
    }

    bookOfTheDay = (req: express.Request, res: express.Response) => {
        BookOfTheday.findOne({}, (err, book) => {
            if (err) console.log(err);
            else {
                if (book) {
                    let bookoftheday = book.toObject();
                    let today = new Date();
                    let bookday = new Date(bookoftheday.date);
                    if (bookday.getDate() == today.getDate() && bookday.getMonth() == today.getMonth() && bookday.getFullYear() == today.getFullYear()) {
                        Book.findOne({ "id": book.id }, (err, book) => {
                            if (err) console.log(err);
                            else res.json(book);
                        })
                    }

                    else {
                        // change book of the day
                        Book.estimatedDocumentCount((err, number) => {
                            if (err) console.log(err);
                            else {

                                Book.find({ "status": "pending" }, (err, reqbooks) => {
                                    if (err) console.log(err);
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
                                        Book.findOne({ "id": index }, (err, book) => {
                                            if (err) console.log(err);
                                            else {
                                                BookOfTheday.deleteOne({}, (err) => {
                                                    if (err) console.log(err);
                                                    else {
                                                        BookOfTheday.collection.insertOne({ "id": index, "date": today }, (err, retval) => {
                                                            if (err) console.log(err);
                                                            else res.json(book);
                                                        })
                                                    }
                                                })
                                            }


                                        })

                                    }
                                })


                            }
                        })
                    }
                }
                else {
                    //create book of the day
                    Book.estimatedDocumentCount((err, number) => {
                        if (err) console.log(err);
                        else {
                            Book.find({ "status": "pending" }, (err, reqbooks) => {
                                if (err) console.log(err);
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

                                    Book.findOne({ "id": index }, (err, book) => {
                                        if (err) console.log(err);
                                        else {

                                            let booktet = book;
                                            let today = new Date();
                                            BookOfTheday.collection.insertOne({ "id": index, "date": today }, (err, retval) => {
                                                if (err) console.log(err);
                                                else res.json(booktet);
                                            })




                                        }
                                    })
                                }
                            });
                        }

                    })
                }
            }
        })
    }

    borrowedBooks = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        Borrowed.collection.aggregate([{
            $lookup: {
                from: "books",
                localField: "id",
                foreignField: "id",
                as: "booksborrowed"

            }
        }]).toArray((err, result) => {
            if (err) console.log(err);
            else {

                res.json(result);

            }
        });


    }

    monthlyBooks = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let today = new Date();
        let lastyear = new Date();
        lastyear.setFullYear(lastyear.getFullYear() - 1);

        Borrowed.find({ "username": username, "dateTaken": { "$gte": lastyear, "$lte": today } }, (err, borrowed) => {
            if (err) console.log(err);
            else res.json(borrowed);
        })


    }

    notificationSent = (req: express.Request, res: express.Response) => {
        let ids = req.body.ids;
        let username = req.body.username;
        Borrowed.updateMany({ "username": username, "id": { $in: ids } }, { "reservation": false }, (err, call) => {
            if (err) console.log(err);
        })
    }
}
