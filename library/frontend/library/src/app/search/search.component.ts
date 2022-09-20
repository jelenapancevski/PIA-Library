import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Author } from '../models/author';
import { Book } from '../models/book';
import { Genre } from '../models/genre';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }

  ngOnInit(): void {
    this.authors=[];
    this.Authors="";
    this.firstname="";
    this.lastname="";
    this.title="";
    this.authors[0]="";
    this.authors[1]="";
    this.result=false;
    this.parameters=[];
    this.user=JSON.parse(sessionStorage.getItem("user"));
    if(this.user){
      if(this.user.type=='admin') {
        this.router.navigate(["/admin"]);
      return}
      else {
        this.guest=false;
      }
    } 
    else this.guest=true;
    this.bookService.genre().subscribe((genres:Array<Genre>)=>{
      this.genres= genres;
    })
  }
  authors:Array <String>;
  Authors: string;
  firstname: string;
  lastname: string;
  title: string;
  books: Array<Book>
  message: string;
  user: User;
  genres: Array<Genre>;
  selectedGenres:Array<String>;
  from: number;
  to: number;
  publisher: string;
  result: boolean;
  parameters:Array<String>;
  guest:boolean;
  addAuthor(){
    if(this.firstname=="" && this.lastname=="") return;
    this.authors[0]+=this.firstname+" ";
    this.authors[1]+=this.lastname+" ";
    this.Authors+=this.firstname;
    if(this.lastname=="") this.Authors+=",";
    else this.Authors+=" "+this.lastname+",";
    this.firstname=this.lastname="";
  }
  resetParam(){
    this.parameters=[];
    this.parameters.push(this.title);
    this.parameters.push(this.Authors);
    if(!this.guest && this.selectedGenres) this.parameters.push(this.selectedGenres.toString());
    else this.parameters.push("");
    if(this.from) this.parameters.push(this.from.toString());
    else this.parameters.push("");
    if(this.to) this.parameters.push(this.to.toString());
    else this.parameters.push("");
    if(this.publisher) this.parameters.push(this.publisher);
    else this.parameters.push("");
    this.authors[0]="";
    this.authors[1]="";
    this.Authors="";
    this.title=this.firstname=this.lastname="";
    this.selectedGenres=null;
    this.from=null;
    this.to=null;
    this.publisher=null;
    this.result=true;
  }
  advancedSearch(){
    if(this.selectedGenres){
      // advanced search by Genre
      let books=[];
      for (let book of this.books){
        let found=false;
        for ( let genre of this.selectedGenres){
          
            if(book.genres.indexOf(genre.toString())>-1){
              found=true;
              break;
            }
        }
        if(found){
        books.push(book);
        }
       
      } 
      this.books=books;

    }
    // search by year published
    if(this.from || this.to){
      let books=[];
      for (let book of this.books){
          if(this.from && this.to){
            if(book.yearPublished>=this.from && book.yearPublished<=this.to){
              books.push(book);
            }
          }else if(this.from){
            if(book.yearPublished>=this.from ){
              books.push(book);
            }
          }else {
           if(book.yearPublished<=this.to){
            books.push(book);
           }
          }
        }

        this.books=books;
    
      }
      // advance search by publisher
      if(this.publisher){
        let books=[];
      for (let book of this.books){
           if(book.publisher==this.publisher){
            books.push(book);
           }
          
        }
        this.books=books;
    
      }
    
  }
  search(){
    if(this.Authors==""){
      this.bookService.search(this.title,null).subscribe((books:Array<Book>)=>{
      
        this.books=books;
        if(this.user) this.advancedSearch();
        this.resetParam();
       
      })
    }
    else if( this.title!="" && this.Authors!=""){
     
    
      this.bookService.search(this.title,this.authors).subscribe((books:Array<Book>)=>{
      
        this.books=books;
        if(this.user) this.advancedSearch();
        this.resetParam();
      })
    }
    
    else {
      this.bookService.search(null,this.authors).subscribe((books:Array<Book>)=>{
        this.books=books;
        if(this.user) this.advancedSearch();
        this.resetParam();
        
      })
    }
  }
  bookDetails(id){
    //sessionStorage.setItem("bookId",JSON.stringify(id));
    this.router.navigate(['/info',JSON.stringify(id)]);
  }
 
}
