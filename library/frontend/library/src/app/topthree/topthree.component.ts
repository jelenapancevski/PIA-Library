import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import topThree from '../models/topThree';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-topthree',
  templateUrl: './topthree.component.html',
  styleUrls: ['./topthree.component.css'],
  providers:[NgbCarouselConfig]
})
export class TopthreeComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService,private router: Router, config:NgbCarouselConfig) {
    config.interval=3000;
    config.keyboard=true;
    config.pauseOnHover=true;
   }

  

  ngOnInit(): void {
    
   this.user=JSON.parse(sessionStorage.getItem("user"));
    if(this.user && this.user.type=="admin"){
     this.router.navigate(['/admin']);
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
  bookDetails(id){
    //sessionStorage.setItem("bookId",JSON.stringify(id));
    this.router.navigate(['/info',JSON.stringify(id)]);
  }
  
}
