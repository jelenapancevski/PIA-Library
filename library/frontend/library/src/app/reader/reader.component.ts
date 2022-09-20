import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService, private router: Router) { }

  calculatereview() {
    this.noreviews = false;
    this.stars = [];
    let sum = 0;
    let cnt = 0;
    for (let comment of this.bookOfTheDay.comments) {
      cnt++;
      sum += comment.review;

    }
    if (cnt > 0) {

      this.review = sum / cnt;
      for (let i = 0; i < Math.floor(this.review); i++) {
        this.stars.push("assets/fullstar.png");
      }
      for (let i = Math.floor(this.review); i < 10; i++) {
        this.stars.push("assets/emptystar.png");
      }

    }
    else this.noreviews = true;
  }
  stars: Array<String>;
  review: number;
  noreviews: boolean;

  ReturnDay(date:Date,days:number){
    let LastDay= new Date(date);
    LastDay.setDate(LastDay.getDate()+days);
    return LastDay;
  }
  daysLeft(date1: Date, date2: Date) {
    let difference = new Date(date2).getTime() - new Date(date1).getTime(); //miliseconds
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  Isoverdue(LastDay: Date) {
    let today = new Date();
    if (LastDay < today) return true;
    else return false;

  }
  setAuthors(b) {
    b.allauthors = "";
    for (let author of b.authors) {
      if (author.firstname) {
        b.allauthors += author.firstname;
        if (author.lastname) b.allauthors += " ";
      }
      if (author.lastname) b.allauthors += author.lastname;
      if (b.authors[b.authors.length - 1] != author) b.allauthors += ", ";
    }
  }
  expiredDeadlines() {
    this.exdeadlineBook = [];
    this.returnBooks = [];
    for (let borrow of this.borrowed) {
      if (borrow.dateTaken && borrow.dateReturned == null) {
        let returndate = this.ReturnDay(new Date(borrow.dateTaken), borrow.days);
        if (this.Isoverdue(returndate)) {
          this.bookService.bookInfo(borrow.id).subscribe((book: Book) => {
            this.setAuthors(book);
            this.exdeadlineBook.push(book);
          })
        } else {
          let days = this.daysLeft(new Date(), returndate);
          if (days <= 2) {
            this.bookService.bookInfo(borrow.id).subscribe((book: Book) => {
              this.setAuthors(book);
              this.returnBooks.push(book);
            })
          }

        }
      }
    }

  }
  setBookOfTheDay() {
    this.bookService.bookOfTheDay().subscribe((book: Book) => {
      this.bookOfTheDay = book;
      this.setAuthors(this.bookOfTheDay);
      this.calculatereview();
    })

  }
  activeBorrows() {
    let cnt = 0;
    this.reservations = [];
    this.reservedBooks = [];
    for (let borrow of this.borrowed) {
      if (borrow.dateTaken && borrow.dateReturned == null) cnt++;
      if (borrow.dateTaken && borrow.dateReturned == null && borrow.reservation == true) {

        this.reservations.push(borrow);
      }
    }
    if (cnt == 3) this.maximum = true;
    else this.maximum = false;
    if (this.reservations.length > 0) {
      this.bookService.allBooks().subscribe((books: Book[]) => {
        for (let res of this.reservations) {
          for (let b of books) {
            if (b.id == res.id) {
              this.setAuthors(b);
              this.reservedBooks.push(b);
            }

          }
        }
        this.bookService.notificationSent(this.reservations, this.user.username).subscribe();
      })

    }
  }
  ngOnInit(): void {
    this.suggested=[];
    this.requestedBooks=[];
    this.borrowed=[];
    this.exdeadlineBook=[];
    this.returnBooks=[];
    this.reservations= [];
    this.reservedBooks= [];
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if (!this.user) {
      this.router.navigate(['/']);
      return;
    }
    if (this.user.type == "admin") {
      // case "moderator": this.router.navigate(['/moderator']);
      //return;
      this.router.navigate(['/admin']);
      return;
    }
    this.setBookOfTheDay();
    this.bookService.borrows(this.user.username).subscribe((borrowed: Borrowed[]) => {
      this.borrowed = borrowed;
      this.activeBorrows();
      this.expiredDeadlines();


    })


    this.bookService.suggested(this.user.username).subscribe((books: Book[]) => {
      this.suggested = books;
      this.requestedBooks = [];


      for (let b of this.suggested) {
        if (b.username == this.user.username) {
          if (b.status == 'active') {
            this.setAuthors(b);
            this.requestedBooks.push(b);
          }


        }
      }
    })
  }
  maximum: boolean;
  user: User;
  suggested: Book[];
  requestedBooks: Book[];
  borrowed: Borrowed[];
  exdeadlineBook: Book[];
  returnBooks: Book[];
  reservations: Borrowed[];
  reservedBooks: Book[];
  bookOfTheDay: Book;

  bookDetails(id){
    //sessionStorage.setItem("bookId",JSON.stringify(id));
    this.router.navigate(['/info',JSON.stringify(id)]);
  }
}
