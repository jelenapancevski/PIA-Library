import express from 'express';
import { BooksController } from '../controllers/books.controller';

const bookRouter = express.Router();

bookRouter.route('/allBooks').get((req,res)=> new BooksController().allBooks(req,res));

bookRouter.route('/allBorrowed').get((req,res)=> new BooksController().allBorrowed(req,res));

bookRouter.route('/addBook').post((req,res)=> new BooksController().addBook(req,res));

bookRouter.route('/requestBook').post((req,res)=> new BooksController().requestBook(req,res));

bookRouter.route('/acceptRequest').post((req,res)=> new BooksController().acceptRequest(req,res));

bookRouter.route('/denyRequest').post((req,res)=> new BooksController().denyRequest(req,res));

bookRouter.route('/getRequests').get((req,res)=> new BooksController().getRequests(req,res));

bookRouter.route('/setDays').post((req,res)=> new BooksController().setDays(req,res));

bookRouter.route('/search').post((req,res)=> new BooksController().search(req,res));

bookRouter.route('/borrow').post((req,res)=> new BooksController().borrow(req,res));

bookRouter.route('/autoborrow').post((req,res)=> new BooksController().autoborrow(req,res));

bookRouter.route('/reserve').post((req,res)=> new BooksController().reserve(req,res));

bookRouter.route('/returnbook').post((req,res)=> new BooksController().returnbook(req,res));

bookRouter.route('/comment').post((req,res)=> new BooksController().comment(req,res));

bookRouter.route('/editcom').post((req,res)=> new BooksController().editcom(req,res));

bookRouter.route('/updateTitle').post((req,res)=> new BooksController().updateTitle(req,res));

bookRouter.route('/updateAuthors').post((req,res)=> new BooksController().updateAuthors(req,res));

bookRouter.route('/updateGenre').post((req,res)=> new BooksController().updateGenre(req,res));

bookRouter.route('/updatePublisher').post((req,res)=> new BooksController().updatePublisher(req,res));

bookRouter.route('/updateYearPublished').post((req,res)=> new BooksController().updateYearPublished(req,res));

bookRouter.route('/updateLanguage').post((req,res)=> new BooksController().updateLanguage(req,res));

bookRouter.route('/updateImage').post((req,res)=> new BooksController().updateImage(req,res));

bookRouter.route('/updateQuantity').post((req,res)=> new BooksController().updateQuantity(req,res));

bookRouter.route('/delete').post((req,res)=> new BooksController().delete(req,res));

bookRouter.route('/topThree').get((req,res)=> new BooksController().topThree(req,res));

bookRouter.route('/genre').get((req,res)=> new BooksController().genre(req,res));

bookRouter.route('/borrows').post((req,res)=> new BooksController().borrows(req,res));

bookRouter.route('/suggested').post((req,res)=> new BooksController().suggested(req,res));

bookRouter.route('/bookInfo').post((req,res)=> new BooksController().bookInfo(req,res));

bookRouter.route('/extend').post((req,res)=> new BooksController().extend(req,res));

bookRouter.route('/bookOfTheDay').get((req,res)=> new BooksController().bookOfTheDay(req,res));

bookRouter.route('/borrowedBooks').post((req,res)=> new BooksController().borrowedBooks(req,res));

bookRouter.route('/monthlyBooks').post((req,res)=> new BooksController().monthlyBooks(req,res));

bookRouter.route('/notificationSent').post((req,res)=> new BooksController().notificationSent(req,res));
export default bookRouter;