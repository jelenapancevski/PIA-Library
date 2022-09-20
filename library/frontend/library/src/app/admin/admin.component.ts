import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { Genre } from '../models/genre';
import { Message } from '../models/message';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor( private route: ActivatedRoute,private userService: UserService, private bookService: BooksService,private router: Router) {
    AppComponent.adminpage=true;
   }
   onFileSelected(event) {
    //const element = event.currentTarget as HTMLInputElement;
    
    this.file= event.target.files[0];
    
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.show =params.get("page");
    });
    this.bookService.genre().subscribe((genres:Genre[])=>{
      this.genres=genres;
    })
    this.userService.allusers().subscribe((users:User[])=>{
      this.changedusers=users;
      this.bookService.allBorrowed().subscribe((allborrowed:Borrowed[])=>{
        this.allborrowed=allborrowed;
        for (let user of this.changedusers){
          user.notborrowed=true;
          for (let borrow of this.allborrowed){
            if(borrow.username==user.username){
              user.notborrowed=false;
              break;
            }
          }
        }
        
      })
      
      
    })
    this.userService.allusers().subscribe((users:User[])=>{
      this.allusers=users;
      
    })
    this.bookService.allBooks().subscribe((books:Book[])=>{
      this.allBooks=books;
      
    })
   
    
    this.user=JSON.parse(sessionStorage.getItem("user"));
    if(this.user!=null)
    switch(this.user.type){
     case "moderator": this.router.navigate(['/reader']);
      return;
        
    case "reader": this.router.navigate(['/reader']);
     return;
    }
  }
file: File;
genres: Genre[];
allborrowed: Borrowed[];
allBooks:Book[];
allusers: User[];
changedusers: User[];
changedbooks: Book[];
user: User;
username:string;
password:string;
message:string;

deleteUser(username){
  this.userService.deleteUser(username).subscribe((message:Message)=>{
    //alert(message.message);
  document.location.reload();
  });
}
login(){
 
  this.userService.login(this.username,this.password).subscribe((resp:Object)=>{
    let user = <User>resp;
    if(user.type) {
     
      if(user.status=="pending") return alert("Waiting for approval");
      if(user.type=="reader" || user.type=='moderator'){
        this.message="Wrong username or password";
        return;
      }
      sessionStorage.setItem("user", JSON.stringify(user));
      document.location.reload();
    }
    else {
      this.message= (<Message>resp).message;//'Wrong username or password';
      return;
    }
   
    
    
});

}

show:string;


approveRequest(username){
  this.userService.acceptRequest({"username":username}).subscribe(()=>{
    let index=0;
    for (let user of this.changedusers){
      if(user.username==username){
        break;
      }
      index++;
    }
    this.changedusers[index].status='active';
  })
}
denyRequest(username){
  this.userService.denyRequest({"username":username}).subscribe((message:Message)=>{
    document.location.reload();
    
  })
}
logout(){
  this.user=null;
  sessionStorage.removeItem("user");
  this.router.navigate(['/admin']);
  
}
checkPassword(user:User){
//Provera lozinke
if(!user.password.match(/[A-Z]+/)) {
  alert("Password must include at least one upper case letter"); // bar jedno veliko slovo
  return false;
} 
if(!user.password.match(/\W+/)) {
 alert("Password must contain at least one special character"); // bar jedan specijalan karakter
return false;
}
if(!user.password.match(/^[a-zA-Z]+/)) {
  alert("Password must start with a letter");
  return false;
}

if ((user.password.length<8) || (user.password.length)>12) { alert("Password length inadequate");
return false;}
return true;
}

checkEmail(user:User){
  if(!user.email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)) {
    alert("Invalid email format");
    return false;
  } return true;
}
checkPhone(user:User){
  if(!user.phone.match(/^06[0-9]{7,8}$/)){alert("Invalid phone format");
  return false;} 
  return true;
}
Savechanges(username){
    let index=0;
    for (let user of this.changedusers){
      if(user.username==username){
        break;
      }
      index++;
    }

  if(! this.checkPassword(this.changedusers[index])) return;
  //Provera email-a
  if(!this.checkEmail(this.changedusers[index])) return;
  //Provera telefona
  if(!this.checkPhone(this.changedusers[index])) return;

  let updateuser = new User();

    updateuser.username=null;
    if(this.allusers[index].firstname==this.changedusers[index].firstname){
      // Firstname the same
     updateuser.firstname=null;
    }
    else updateuser.firstname= this.changedusers[index].firstname;

    if(this.allusers[index].lastname==this.changedusers[index].lastname){
      // Lastname the same
      updateuser.lastname=null;
    }
    else updateuser.lastname=this.changedusers[index].lastname;

    if(this.allusers[index].email==this.changedusers[index].email){
      // Email the same
      updateuser.email=null;
    }else updateuser.email=this.changedusers[index].email;

    if(this.allusers[index].password==this.changedusers[index].password){
      // password the same
      updateuser.password=null;
    }else updateuser.password=this.changedusers[index].password;

    if(this.allusers[index].phone==this.changedusers[index].phone){
      // phone the same
      updateuser.phone=null;
    }else updateuser.phone=this.changedusers[index].phone;

    if((this.allusers[index].address.city!=this.changedusers[index].address.city )||(this.allusers[index].address.number!=this.changedusers[index].address.number)||(this.allusers[index].address.street!=this.changedusers[index].address.street)){
      // address not the same
      updateuser.address=this.changedusers[index].address;
    } else  updateuser.address=null;


    if(this.file){
      let extension =this.file.type;
      extension=extension.replace(/(.*)\//g, '');
      updateuser.image="assets/"+this.allusers[index].username+"."+ extension;
      
    }else updateuser.image=null;

    this.userService.updateInfo({
      "username": this.allusers[index].username,
      "newusername":null,
      "password":updateuser.password,
      "firstname":updateuser.firstname,
      "lastname":updateuser.lastname,
      "address":updateuser.address,
      "phone":updateuser.phone,
      "email":updateuser.email,
      "image":updateuser.image,
    }).subscribe((message:Message)=>{
      if(message!=null)
      alert(message.message);
      if(this.file){
        //upload picture
        this.userService.uploadFile(this.file,this.allusers[index].username).subscribe();
      }
      document.location.reload();
      /*this.userService.allusers().subscribe((users:User[])=>{
        this.changedusers=users;
        
      })*/
    })
}

changePriveledge(user){
  let type;
  if(user.type=="moderator") type='reader';
  else type="moderator";
  this.userService.updateType(user.username,type).subscribe((message:Message)=>{
    user.type=type;
    //document.location.reload();
  })
}
block(user){
this.userService.block(user.username).subscribe((message:Message)=>{
  //alert(message.message);
  document.location.reload();
})
}
deblock(user){
this.userService.deblock(user.username).subscribe((message:Message)=>{
  //alert(message.message);
  document.location.reload();
})
}




adminpassword:string;
password1:string;
password2:string;
errmessage: string;

changePassword(){
  this.message='';
  if(!this.adminpassword || !this.password1 || !this.password2){
   //alert('Please provide all the information necessary for changing password: old password and new password two times written');
    return;
  }
  if(this.adminpassword!=this.user.password) {
    this.errmessage= "Incorrect password";
    return;
  }
  if(this.password1!=this.password2) {
    this.errmessage= "Passwords dont match";
    return;
  }
  if(!this.password1.match(/[A-Z]+/)){
    this.errmessage= "Password must include at least one upper case letter"; // bar jedno veliko slovo
    return;
  } 
  if(!this.password1.match(/\W+/)) {
    this.errmessage= "Password must contain at least one special character"; // bar jedan specijalan karakter
    return;
  } 
  if(!this.password1.match(/[0-9]+/)) {
    this.errmessage="Password must contain at least one number";
    return;
  }
  if(!this.password1.match(/^[a-zA-Z]+/)){
    this.errmessage="Password must start with a letter";
    return;
  } 
  if ((this.password1.length<8) || (this.password1.length)>12) {
    this.errmessage= "Password length inadequate"; 
    return;
  }
  this.userService.changePassword(this.user.username,this.password1).subscribe(()=>{
     //alert("Password succesfully changed");
     sessionStorage.removeItem("user");
     document.location.reload();
  })
}

}

