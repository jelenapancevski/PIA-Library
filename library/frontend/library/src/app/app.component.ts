import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from './models/message';
import { User } from './models/user';
import { BooksService } from './service/books.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }
  title = 'library';

  ngOnInit(): void {
    this.user=JSON.parse(sessionStorage.getItem("user"));
    AppComponent.adminpage=false;
    
  }
user: User;

  logout(){
    this.user=null;
    sessionStorage.removeItem("user");
    this.router.navigate(['/']);
    //document.location.reload();
   
  }

  username: string;
  password: string;
  message: string;
  static adminpage:boolean;

  login(){
  if(this.username==null || this.password==null) return;
  if(this.username=="" || this.password=="") return;
  this.userService.login(this.username,this.password).subscribe((resp:Object)=>{
      let user = <User>resp;
      if(user.type=="reader" || user.type=='moderator') {
       
        if(user.status=="pending") return alert("Waiting for approval");
        
        sessionStorage.setItem("user", JSON.stringify(user));
        document.location.reload();
        this.router.navigate(['/reader']);
       
        
        
        
        }
        //else if(user.type=="moderator") this.router.navigate(['/moderator']);
        //else if(user.type=="admin")this.router.navigate(["/admin"]);
      else if(user.type=="admin"){
        this.message= 'Incorrect credentials';
      }
      else {
        this.message= (<Message>resp).message;//'Wrong username or password';
      }
      
    }); 
  
  
  }
  register(){
    this.router.navigate(['/register']);

  }
  get adminPage() {
    return AppComponent.adminpage;
  }
}
