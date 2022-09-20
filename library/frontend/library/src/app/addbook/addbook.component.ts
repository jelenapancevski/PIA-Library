import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Author } from '../models/author';
import { Book } from '../models/book';
import { Genre } from '../models/genre';
import { Message } from '../models/message';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddbookComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }
  onFileSelected(event) {
    //const element = event.currentTarget as HTMLInputElement;
    
    this.file= event.target.files[0];
    
  }
  ngOnInit(): void {
    this.user=JSON.parse(sessionStorage.getItem("user"));
    if(!this.user || this.user.status=="blocked") {
      this.router.navigate(['/']);
      return;
    } 
    this.book= new Book();
    this.bookService.genre().subscribe((genres:Array<Genre>)=>{
      this.genres= genres;

    })

  }
  user:User;
  file: File;
  authors:string;
  genres: Array<Genre>;
  selectedGenres:Array<string>;
  uploadFile(event:Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.file= element.files[0];
  
  }
  book: Book;
  addBook(){
    if(this.selectedGenres.length>3) return alert("Maximal is three genres per book");
    // check authors
    this.book.authors=[];
    let flnames= this.authors.split(", ");
    for(let flname of flnames){
      let names = flname.split(" ");
      if(names.length<2){
        this.authors="";
        this.book.authors=[];
        return alert("Incorrect format for authors");
      } 
      if(names.length>2){
        let lastname= "";
        for(let i=1;i<names.length;i++){
          lastname+=names[i]+" ";
        }
        this.book.authors.push({"firstname":names[0],"lastname":lastname});
      }
      else 
      this.book.authors.push({"firstname":names[0],"lastname":names[1]});

    }

    this.book.image="assets/book.jpg";
    
    this.book.status="active";
    this.book.genres=this.selectedGenres;
    this.book.username= (this.user.type=="moderator" || this.user.type=="admin")?null: this.user.username;
    this.book.comments=[];
    

    this.bookService.allBooks().subscribe((books:Book[])=>{
      this.book.id= books[books.length-1].id+1;
      if(this.file){
        let extension =this.file.type;
        extension=extension.replace(/(.*)\//g, '');
       this.book.image="assets/"+this.book.id+"."+ extension;
        
      }
      if(this.user.type!="reader")
      this.bookService.addBook(this.book).subscribe((message:Message)=>{
       // alert(message.message);
        if(this.file){
          //upload picture
          this.userService.uploadFile(this.file,this.book.id).subscribe();
        }
        document.location.reload();
      })
      else  this.bookService.requestBook(this.book).subscribe((message:Message)=>{
        if(this.file){
          //upload picture
          this.userService.uploadFile(this.file,this.book.id).subscribe();
        }
        //alert(message.message);
        document.location.reload();
      })
    })
    
  }
}
