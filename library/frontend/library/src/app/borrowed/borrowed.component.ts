import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { Message } from '../models/message';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-borrowed',
  templateUrl: './borrowed.component.html',
  styleUrls: ['./borrowed.component.css']
})
export class BorrowedComponent implements OnInit{

  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }

  ReturnDay(date:Date,days:number){
    let LastDay= new Date(date);
    LastDay.setDate(LastDay.getDate()+days);
    return LastDay;
  }
    daysLeft(date1:Date,date2:Date,i){
    let difference = new Date(date2).getTime() - new Date(date1).getTime(); //miliseconds
    this.borrowed[i].userdays= Math.ceil(difference / (1000 * 3600 * 24));
    }
  
  Isoverdue(date:Date,LastDay:Date){
    let today = new Date();
    if(LastDay<today) return true;
    else return false;
  
  }

  calcDays(){
   let array = [];
    for (let b of this.borrowed){
        if(b.dateTaken==null || b.dateReturned!=null) continue;
        // reserved or returned 
        array.push(b);
    }
    this.borrowed=array;

    let i=0;
    for (let b of this.borrowed){
      let book;
      for (let bookb of this.books){
        if(bookb.id==b.id){
          book=bookb;
          break;
        }
      }
      b.image= book.image;
      b.authors="";
      for( let author of book.authors){
        b.authors+= author.firstname+" "+ author.lastname;
        if(author !=book.authors[book.authors.length-1]) b.authors+=",";
      }
      let returnDay=this.ReturnDay(b.dateTaken,b.days);
      b.overdue=this.Isoverdue(b.dateTaken,returnDay);
     

      if(b.overdue){
        // calc how many days is late
        this.daysLeft(returnDay,new Date(),i);
      } else{
      // calc days left
      this.daysLeft(new Date(),returnDay,i);
      }  
      
      if(b.days== book.days) b.extended=false;
      else b.extended=true;
      b.title= book.title;
      i++;
    }
      
    
  }
  ngOnInit(): void {
    this.borrowed=[];
    this.user=JSON.parse(sessionStorage.getItem("user"));
    if(!this.user) this.router.navigate(['/']);
      if(this.user.type=="admin"){ 
        this.router.navigate(['/admin']);
        return;
      }
    this.books=[];
    this.bookService.borrows(this.user.username).subscribe((borrowed:Borrowed[])=>{
      this.borrowed= borrowed;
      this.bookService.allBooks().subscribe((books:Book[])=>{
        this.books=books;
        this.calcDays();
      });
      /*for (let b of this.borrowed){
        this.bookService.bookInfo(b.id).subscribe((book:Book)=>{
          this.books.push(book);
          alert(book.image);
          this.calcDays(this.borrowed.length-1);
        })
        
      }*/
      
    })
  }
  user : User;
  borrowed : Array<Borrowed>;
  books: Array <Book>;
  bookDetails(id){
    //sessionStorage.setItem("bookId",JSON.stringify(id));
    this.router.navigate(['/info',JSON.stringify(id)]);
  }
  return(bookId){
    let dateTaken;
      for(let b of this.borrowed){
        if(b.id==bookId)
        dateTaken=b.dateTaken;
      }
    //alert(dateTaken);
    let dateReturned = new Date();
    this.bookService.returnbook(bookId,this.user.username,dateTaken,dateReturned).subscribe((message:Message)=>{
      
     // if(message) alert(message.message);  
      
      document.location.reload();
    })
  }

  extend(bookId,){
    let days;
    for(let b of this.books){
      if(b.id==bookId) days=b.days;
    }
    this.bookService.extend(bookId,this.user.username,days).subscribe(()=>{
      document.location.reload();
    })
  }
}
