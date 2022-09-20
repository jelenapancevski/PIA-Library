import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { Message } from '../models/message';
import topThree from '../models/topThree';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css'],
  providers:[NgbCarouselConfig]
})
export class GuestComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService,private router: Router, config:NgbCarouselConfig) {
    config.interval=3000;
    config.keyboard=true;
    config.pauseOnHover=true;
   }

  ngOnInit(): void {
    
   this.user=JSON.parse(sessionStorage.getItem("user"));
    if(this.user){
      switch(this.user.type){
      case "reader": this.router.navigate(['/reader']);
      break;
      case "moderator": this.router.navigate(['/reader']);
      break;
      case "admin": this.router.navigate(['/admin']);
      break;
      }      
      return;
    }
    
    this.topThree=[];
    this.bookService.topThree().subscribe((borrowss:Array<topThree>)=>{
      let count = 0;
     for (let b of borrowss){
      this.bookService.bookInfo(b._id).subscribe((book:Book)=>{
        this.topThree.push(book);
       
      })
      count++;
      if(count==3) break;
     }
     
    });

  }
  user:User;
  topThree: Array<Book>;
  
}
