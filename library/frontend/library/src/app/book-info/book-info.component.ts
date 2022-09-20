import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { Comment } from '../models/comment';
import { Star } from '../models/star';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit {

  constructor( private route: ActivatedRoute,private userService: UserService, private bookService: BooksService,private router: Router) { }
  Isoverdue(date:Date,days:number){
    let LastDay= new Date(date);
    let day = LastDay.getDate()+days;
    let month = LastDay.getMonth()+1;
    let year = LastDay.getFullYear();
    let maxdays;
    switch(month){
      case 1:case 3: case 5: case 7: case 8: case 10:case 12:
        //31
        maxdays=31;
        break;
      case 2:
        //28 / 29
        if(year%4==0) maxdays=29;
        else maxdays=28;
        break;
      default:
        //30
        maxdays=30;
        break;

    }
    month--;
    if(day>maxdays){
      day=day-maxdays;
      month++;
      if(month==12){
        month=0;
        year++;
      }
    }
    LastDay.setDate(day);
    LastDay.setMonth(month);
    LastDay.setFullYear(year);

    let today = new Date();
    if(LastDay<today) return true;
    else return false;
  
  }
read:boolean;
  setOptions(){
      // check if there are three books or overdue date or already taken
      //already taken
      this.read= false;
      this.taken = false;
      let overdue = false;
      let takenbooks=0;
      for (let b of this.borrows ){
          if(b.dateTaken && b.dateReturned && b.id==this.book.id) this.read=true;
          if(b.dateTaken && b.dateReturned==null){
            // borrowed book
            if(b.id==this.book.id){
              //already borrowed
              this.taken=true;
              this.message="Unable to borrow book - Book is already borrowed";
              this.canborrow=false;
              this.canreserve=false;
              return;
            }

           let overdue= this.Isoverdue(b.dateTaken,b.days);
           if(overdue){
            // has overdue book 
            this.message="Unable to borrow book - there are deadlines for returning that have expired";
            this.canborrow=false;
            this.canreserve=false;
            return;
           }
           takenbooks++;
           if(takenbooks==3){
            this.message="Unable to borrow the book - Already borrowed maximum number of books";
            this.canborrow=false;
            this.canreserve=false;
            return;
           }

            /*
            dateTaken:Date;   //  null if reservation ,  not null if borrowed/ returned
    dateReturned:Date; //null if reservation/borrowed not null if returned */
          }
          else if (b.dateTaken==null && b.id==this.book.id){
            // already reserved
            this.message="Unable to reserve the book - Book is already reserved";
            this.canborrow=false;
            this.canreserve=false;
            return;
          }
      }
      if(this.book.quantity>0){
        this.canborrow=true;
        this.canreserve=false;
      }
      else {
        this.canborrow=false;
        this.canreserve=true;
      }
     
    
  }
  setReviews(){
    this.nocomment=true;
      for (let comment of this.book.comments){
        if(comment.username==this.user.username) {
          this.nocomment=false;
          this.editcomment= comment.comment;
        }
        let date= new Date(comment.date);
        comment.day= date.getDate();
        comment.month= date.getMonth()+1;
        comment.year= date.getFullYear();
        comment.hours = date.getHours();
        comment.minutes= date.getMinutes();
        comment.stars=[];
        for (let i=0;i< comment.review;i++){
          comment.stars.push("assets/fullstar.png");
        }
        for (let i=comment.review;i<10;i++){
          comment.stars.push("assets/emptystar.png");
        }
      }
  }
  calculatereview(){
    this.noreviews=false;
    this.stars=[];
    let sum=0;
    let cnt=0;
    for( let comment of this.book.comments){
      cnt++;
      sum+=comment.review;
      
    }
    if(cnt>0) {
      
      this.review= sum/cnt;
    for (let i=0;i< Math.floor(this.review);i++){
      this.stars.push("assets/fullstar.png");
    }
    for (let i= Math.floor(this.review);i<10;i++){
      this.stars.push("assets/emptystar.png");
    }
    
    }
    else this.noreviews=true;
  }
  sortbyDate(first:Comment,second:Comment){
    if(first.date>second.date) return -1;
    else if(first.date==second.date) return 0;
    else return 1;
  }
  ngOnInit(): void {
    this.editbook=false;
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if(!this.user) {
      this.router.navigate(["/"]);
      return;
    }
    if(this.user.type=='admin'){
      this.router.navigate(["/admin"]);
      return;
    }
    this.newstars=[];
    for (let i=0;i<10;i++){
      this.newstars.push({"id":i+1,"image":"assets/emptystar.png"});
    }
    this.route.paramMap.subscribe(params => {
      this.id =JSON.parse(params.get("id"));
      this.bookService.bookInfo(this.id).subscribe((book:Book)=>{
        if(book==null) this.router.navigate(["/"]);
        this.book=book;
        this.book.comments= this.book.comments.sort(this.sortbyDate);
        this.bookService.borrows(this.user.username).subscribe((borrows:Array<Borrowed>)=>{
          this.borrows=borrows;
          this.setOptions();
          this.calculatereview();
          this.setReviews();
      });
      })
    });
  }
  id: number;
  book: Book;
  user: User;
  borrows : Array<Borrowed>;
  canborrow: boolean;
  canreserve: boolean;
  message: String
  review: number;
  noreviews:boolean;
  stars: Array<String>;
  taken: boolean;
  nocomment: boolean;
  editbook: boolean;
  borrow(){
    let dateTaken = new Date(Date.now());
    this.bookService.borrow(this.book.id,this.user.username,dateTaken,this.book.days).subscribe((message:String)=>{
      document.location.reload();
    })
  }
  reserve(){
    this.bookService.reserve(this.book.id,this.user.username,this.book.days).subscribe((message:String)=>{
      document.location.reload();
    })
  }
  editcomment:string;
  newcomment: string;
  newstars: Array <Star>;
  newreview:number;
  edit(){
    this.bookService.editcom(this.book.id,this.user.username,this.editcomment).subscribe((message:String)=>{
      document.location.reload();
    });
  }
  comment(){
    if(!this.newreview || !this.newcomment) return alert("Provide review and comment");
    this.bookService.comment(this.book.id,this.user.username,this.newcomment,this.newreview,new Date(Date.now())).subscribe(()=>{
      document.location.reload();
    })
  }
  setStars(id){
    this.newreview=id;
    for (let i=0;i<id;i++){
      this.newstars[i].image=("assets/fullstar.png");
    }
    for (let i=id;i<10;i++){
      this.newstars[i].image=("assets/emptystar.png");
    }
  }
}
