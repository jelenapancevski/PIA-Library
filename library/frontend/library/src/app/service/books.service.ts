import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http:HttpClient) { }
  uri="http://localhost:4000";

  topThree(){
    return this.http.get(`${this.uri}/books/topThree`);
  }
  bookInfo(id){
    return this.http.post(`${this.uri}/books/bookInfo`,{"id":id});
  }
  search(title,authors){
    if(authors!=null)
    return this.http.post(`${this.uri}/books/search`,{"title":title, "authors":authors, "firstnames":authors[0], "lastnames":authors[1]});
    else return this.http.post(`${this.uri}/books/search`,{"title":title, "authors":authors});
  }
  genre(){
    return this.http.get(`${this.uri}/books/genre`);

  }
  borrows(username){
    return this.http.post(`${this.uri}/books/borrows`,{"username":username});
  }
  borrow(id,username,dateTaken,days){
    return this.http.post(`${this.uri}/books/borrow`,{"bookId":id,"username":username,"dateTaken":dateTaken,"days":days});
  }
  reserve(id,username,days){
    return this.http.post(`${this.uri}/books/reserve`,{"bookId":id,"username":username,"days":days});
  }

  editcom(id,username,comment){
    return this.http.post(`${this.uri}/books/editcom`,{"bookId":id,"username":username,"comment":comment});

  }
  comment(id,username,comment,review,date){
    return this.http.post(`${this.uri}/books/comment`,{"bookId":id,"username":username,"comment":comment,'review':review,'date':date});

  }
  allBorrowed(){
    return this.http.get(`${this.uri}/books/allBorrowed`);
  }
  allBooks(){
    return this.http.get(`${this.uri}/books/allBooks`);
  }
  returnbook(bookId,username,dateTaken,dateReturned){
    return this.http.post(`${this.uri}/books/returnbook`,{"bookId":bookId,"username":username,"dateTaken":dateTaken,'dateReturned':dateReturned});
  }
  extend(bookId,username,days){
    return this.http.post(`${this.uri}/books/extend`,{"bookId":bookId,"username":username,"days":days});
  }

  addBook(book:Book){
    return this.http.post(`${this.uri}/books/addBook`,{"id":book.id,"title":book.title,"authors":book.authors,'genres':book.genres,'publisher':book.publisher,'yearPublished':book.yearPublished,"language":book.language,'image':book.image,'quantity':book.quantity,'days':book.days});
  }
  
  requestBook(book:Book){
    return this.http.post(`${this.uri}/books/requestBook`,{"id":book.id,"title":book.title,"authors":book.authors,'genres':book.genres,'publisher':book.publisher,'yearPublished':book.yearPublished,"language":book.language,'image':book.image,'username':book.username});
  }
  getRequests(){
    return this.http.get(`${this.uri}/books/getRequests`);
  }
  acceptRequest(id){
    return this.http.post(`${this.uri}/books/acceptRequest`,{"id":id});
  }
  denyRequest(id){
    return this.http.post(`${this.uri}/books/denyRequest`,{"id":id});
  }
  delete(id){
    return this.http.post(`${this.uri}/books/delete`,{"id":id});
  }

  updateTitle(id,title){
    return this.http.post(`${this.uri}/books/updateTitle`,{"id":id,'title':title});
  }
  updateAuthors(id,authors){
    return this.http.post(`${this.uri}/books/updateAuthors`,{"id":id,'authors':authors});
  }

  updateGenre(id,genres){
    return this.http.post(`${this.uri}/books/updateGenre`,{"id":id,'genres':genres});
  }

  updatePublisher(id,publisher){
    return this.http.post(`${this.uri}/books/updatePublisher`,{"id":id,'publisher':publisher});
  }
  updateYearPublished(id,yearPublished){
    return this.http.post(`${this.uri}/books/updateYearPublished`,{"id":id,'yearPublished':yearPublished});
  }

  updateLanguage(id,language){
    return this.http.post(`${this.uri}/books/updateLanguage`,{"id":id,'language':language});
  }

  updateImage(id,image){
    return this.http.post(`${this.uri}/books/updateImage`,{"id":id,'image':image});
  }
  updateQuantity(id,quantity){
    return this.http.post(`${this.uri}/books/updateQuantity`,{"id":id,'quantity':quantity});
  }
  setDays(id,days){
    return this.http.post(`${this.uri}/books/setDays`,{"id":id,'days':days});
  }
  suggested(username){
    return this.http.post(`${this.uri}/books/suggested`,{"username":username});
  }
  bookOfTheDay(){
    return this.http.get(`${this.uri}/books/bookOfTheDay`);

  }
  borrowedBooks(username){
    return this.http.post(`${this.uri}/books/borrowedBooks`,{"username":username});
  }

  monthlyBooks(username){
    return this.http.post(`${this.uri}/books/monthlyBooks`,{"username":username});

  }
  notificationSent(reservations,username){
    let ids=[];
    for(let r of reservations){
      ids.push(r.id);
    }
    return this.http.post(`${this.uri}/books/notificationSent`,{"username":username,'ids':ids});
  }
}
