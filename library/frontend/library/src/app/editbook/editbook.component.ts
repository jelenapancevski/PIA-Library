import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { Genre } from '../models/genre';
import { Message } from '../models/message';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-editbook',
  templateUrl: './editbook.component.html',
  styleUrls: ['./editbook.component.css']
})
export class EditbookComponent implements OnInit {
  file: File;
  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }
  onFileSelected(event) {
    //const element = event.currentTarget as HTMLInputElement;
    
    this.file= event.target.files[0];
    
  }
  ngOnInit(): void {
    this.bookService.genre().subscribe((genres:Genre[])=>{
      this.genres=genres;
    })
    this.bookService.bookInfo(this.book.id).subscribe((book:Book)=>{
      this.changedbook=book;
      
      
        this.bookService.allBorrowed().subscribe((borrowed:Borrowed[])=>{
          this.allborrowed= borrowed;
          
          this.changedbook.allauthors="";
          this.changedbook.selectedgenres=[];
            for (let author of this.changedbook.authors){
              if(author.firstname){
                this.changedbook.allauthors+= author.firstname;
                if(author.lastname) this.changedbook.allauthors+=" ";
              }
             if(author.lastname)this.changedbook.allauthors+= author.lastname;
              if(this.changedbook.authors[this.changedbook.authors.length-1]!=author) this.changedbook.allauthors+=", ";
            }
            this.changedbook.notborrowed=true;
            for (let borrow of this.allborrowed){
              if(borrow.id==this.changedbook.id){
                this.changedbook.notborrowed=false;
                break;
              }
            }
          
        })
    })

    
  }
  @Input()book:Book;

  allborrowed: Borrowed[];
  changedbook: Book;
  genres: Genre[];
  deleteBook(){
    this.bookService.delete(this.book.id).subscribe((message:Message)=>{
        //if(message) alert(message.message);
        document.location.reload();
    });
  }
  UpdateBookInfo(){
   
     if(this.changedbook.selectedgenres.length>3) return alert("Maximal is three genres per book");
     // check authors
     this.changedbook.authors=[];
     let flnames= this.changedbook.allauthors.split(", ");
     for(let flname of flnames){
       let names = flname.split(" ");
       if(names.length<2){
         return alert("Incorrect format for authors");
       } 
       if(names.length>2){
         let lastname= "";
         for(let i=1;i<names.length;i++){
           lastname+=names[i]+" ";
         }
         this.changedbook.authors.push({"firstname":names[0],"lastname":lastname});
       }
       else 
       this.changedbook.authors.push({"firstname":names[0],"lastname":names[1]});
   
     }
   try {
    if(this.changedbook.title!= this.book.title){
      //update Title
        this.bookService.updateTitle(this.book.id,this.changedbook.title).subscribe((message:Message)=>{
          //alert(message.message);
        })
    }
    if(this.changedbook.publisher!=this.book.publisher){
      //update Publisher
      this.bookService.updatePublisher(this.book.id,this.changedbook.publisher).subscribe((message:Message)=>{
       // alert(message.message);
      })
    }
    if(this.changedbook.yearPublished!=this.book.yearPublished){
      //update yearPublished
      this.bookService.updateYearPublished(this.book.id,this.changedbook.yearPublished).subscribe((message:Message)=>{
        //alert(message.message);
      })
    }
    if(this.changedbook.language!=this.book.language){
      //update language
      this.bookService.updateLanguage(this.book.id,this.changedbook.language).subscribe((message:Message)=>{
       // alert(message.message);
      })
    }
    if(this.changedbook.quantity!=this.book.quantity){
      //update quantity
      this.bookService.updateQuantity(this.book.id,this.changedbook.quantity).subscribe((message:Message)=>{
       // alert(message.message);
      })
    }
    if(this.changedbook.days!=this.book.days){
      //update days
      this.bookService.setDays(this.book.id,this.changedbook.days).subscribe((message:Message)=>{
        //alert(message.message);
      })
    }
    if(this.file){
      let extension =this.file.type;
      extension=extension.replace(/(.*)\//g, '');
      this.book.image="assets/"+this.book.id+"."+ extension;
      this.bookService.updateImage(this.book.id,this.book.image).subscribe();
      this.userService.uploadFile(this.file,this.book.id).subscribe();
    }
    let different = false;
    if(this.changedbook.authors.length!=this.book.authors.length)different=true;
  
    for (let i=0;i<this.changedbook.authors.length;i++){
        if(different) break;
        if(i>=this.book.authors.length) {
          different=true;
          break;
        }
      if(this.changedbook.authors[i].firstname!=this.book.authors[i].firstname) different=true;
      if(this.changedbook.authors[i].lastname!=this.book.authors[i].lastname) different=true;
    }
  
    if(different){
      //update authors
      this.bookService.updateAuthors(this.book.id,this.changedbook.authors).subscribe((message:Message)=>{
       // alert(message.message);
      })
    }
    different=false;
  
    if(this.changedbook.genres.length!=this.changedbook.selectedgenres.length)different=true;
    
    for (let i=0;i<this.changedbook.selectedgenres.length;i++){
      if(different) break;
      if(i>=this.changedbook.genres.length) {
        different=true;
        break;
      }
    if(this.changedbook.genres[i]!=this.changedbook.selectedgenres[i]) different=true;
    
  
  }
  if(different && this.changedbook.selectedgenres.length!=0){
    //update genre
  
   this.bookService. updateGenre(this.book.id,this.changedbook.selectedgenres).subscribe((message:Message)=>{
     // alert(message.message);

    })
  }
   }finally{
      document.location.reload();
   }
     
   


   }

  

}
