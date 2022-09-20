import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }



  setInfo(){
   let array = [];
    for (let b of this.borrowed){
        if(b.dateTaken==null || b.dateReturned==null) continue;
        // reserved or not returned 
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
      b.title= book.title;
      b.dateTakenString = `${new Date(b.dateTaken).getDate()}/${new Date(b.dateTaken).getMonth()+1}/${new Date(b.dateTaken).getFullYear()}`;
      b.dateReturnedString = `${new Date(b.dateReturned).getDate()}/${new Date(b.dateReturned).getMonth()+1}/${new Date(b.dateReturned).getFullYear()}`
      b.authorlastname= book.authors[0].lastname;
      for( let author of book.authors){
        b.authors= author.firstname+" "+ author.lastname;
        if(author != book.authors[book.authors.length-1]) b.authors+=",";
      }
      i++;
    }
      
    
  }
  ngOnInit(): void {
    this.sorting=[0,0,1,1];
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
        this.setInfo();
        this.sort(3);
      });
      
    })
  }
  user : User;
  borrowed : Array<Borrowed>;
  books: Array <Book>;
  sorting:Array<number>; //0-asc 1-desc
  bookDetails(id){
    //sessionStorage.setItem("bookId",JSON.stringify(id));
    this.router.navigate(['/info',JSON.stringify(id)]);
  }

  sort(sort){
    switch(sort){
      case 0:
        //sort by title
        if(this.sorting[sort]==0) 
        {
            //asc
            this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
              return a.title>b.title?1:-1;
            });
            this.sorting[sort]=1;
        }
        
        else {//desc
          this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
            return a.title<b.title?1:-1;
          });
          this.sorting[sort]=0;
        }
        break;
      case 1:
        // sort by author lastname
        if(this.sorting[sort]==0) 
        {   //asc
        this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
          return a.authorlastname>b.authorlastname?1:-1;
        });
        this.sorting[sort]=1;
      }
      else {
          //desc
          this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
            return a.authorlastname<b.authorlastname?1:-1;
          });
          this.sorting[sort]=0;
      }
        break;
      case 2:
         // sort by date Taken
        if(this.sorting[sort]==0) 
        {   //asc
        this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
          return a.dateTaken>b.dateTaken?1:-1;
        });
        this.sorting[sort]=1;
      } else {// desc
        this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
          return a.dateTaken<b.dateTaken?1:-1;
        });
        this.sorting[sort]=0;
      }
        break;
      case 3:
        if(this.sorting[sort]==0) 
        {   //asc
        this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
          return a.dateReturned>b.dateReturned?1:-1;
        });
        this.sorting[sort]=1;
      }
      else {
        // desc
        //sort by date Returned
        this.borrowed.sort((a:Borrowed,b:Borrowed)=>{
          return a.dateReturned<b.dateReturned?1:-1;
        });
        this.sorting[sort]=0;
      }
        
        break;
    }
  }
 

}
