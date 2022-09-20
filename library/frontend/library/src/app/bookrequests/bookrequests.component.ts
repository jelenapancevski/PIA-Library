import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models/book';
import { Message } from '../models/message';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-bookrequests',
  templateUrl: './bookrequests.component.html',
  styleUrls: ['./bookrequests.component.css']
})
export class BookrequestsComponent implements OnInit {

  constructor( private route: ActivatedRoute,private userService: UserService, private bookService: BooksService,private router: Router) { }


  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if(!this.user) {
      this.router.navigate(["/"]);
      return;
    }
    switch(this.user.type){
      case "reader": this.router.navigate(["/reader"]);
      return;
      case "admin": this.router.navigate(["/admin"]);
      return;
    }
   this.bookService.getRequests().subscribe((books:Book[])=>{
    this.bookrequests=books;
   })
  }
  bookrequests: Book [];
  user:User;
  
  acceptRequest(id){
    this.bookService.acceptRequest(id).subscribe((message:Message)=>{
      //alert(message.message);
      document.location.reload();
    })
  }
  denyRequest(id){
    this.bookService.denyRequest(id).subscribe(()=>{
      document.location.reload();
    })
  }
}
