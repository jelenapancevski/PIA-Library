import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from '../models/address';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router,private formbuilder:FormBuilder, private userService: UserService) { }
  ngOnInit(): void {
    this.address= new Address();
   this.user = JSON.parse(sessionStorage.getItem("user"));
   if(this.user){
    switch(this.user.type){
      case "reader":case "moderator": this.router.navigate(['/reader']);
      break;
      //case "moderator": this.router.navigate(['/moderator']);
      //  break;
      //case "admin": this.router.navigate(['/admin']);
        //break;
    }
    return 
    
  }
  }
  message: String;
  user:User;
  file: File;
  addr: string;
  firstname:string;
  lastname:string;
  username:string;
  password:string;
  passwordconfirm:string;
  phone:string;
  email:string;
  address: Address;
  image: string;
registrate(){
  //Provera lozinke
  if(this.password!=this.passwordconfirm)
  {
    this.message= "Passwords dont match";
    return;
  } 
  if(!this.password.match(/[A-Z]+/)) {
    this.message= "Password must include at least one upper case letter";// bar jedno veliko slovo
    return;
  }
  if(!this.password.match(/\W+/)){
    this.message="Password must contain at least one special character";// bar jedan specijalan karakter
    return;
  } 
  if(!this.password.match(/[0-9]+/)) {
    this.message= "Password must contain at least one number";
    return;
  }
  if(!this.password.match(/^[a-zA-Z]+/)) {
    this.message= "Password must start with a letter";
    return;
  }
  if ((this.password.length<8) || (this.password.length)>12) {
    this.message= "Password length inadequate 8-12 characters needed";
    return;
  } 

  //Provera email-a
  if(!this.email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)) {
    this.message= "Invalid email format";
    return;
  }

  //Provera telefona

  if(!this.phone.match(/^06[0-9]{7,8}$/)) {
    this.message= "Invalid phone format";
    return;
  }

  //Provera adrese
  this.address.street=this.address.city='';
  let array = this.addr.split(", ");///^[a-zA-Z ]+ [0-9]+ [a-zA-Z]+/);
  if(array.length<2 || array.length>2) {
    this.message= "Invalid address format valid format: Street streetNo, City";
    return;
  }
  let arr = array[0].split(" ");
  let i;
  for (i=0;i<arr.length;i++){
    
    if(isNaN(parseInt(arr[i]))){
      if(i>0)this.address.street+=" ";
      this.address.street+=arr[i];
    } 
    else break;

  }
  this.address.number=parseInt(arr[i]);
 
  this.address.city= array[1];  
  
  if(this.address.city=='' || this.address.street=="" || this.address.number==NaN)  {
    this.message= "Invalid address format valid format: Street streetNo, City";
    return;
  }
  //Email and username unique

  this.userService.checkavailability(this.username,this.email).subscribe((users:User[])=>{
        if(users.length>0){
            if(users[0].username==this.username) {
              this.message="Username is taken";
            }
            else  this.message="Email is taken";
          return;
        }

    //image check add and save 
    this.image="assets/user.png";
    if(this.file){
      let extension =this.file.type;
      extension=extension.replace(/(.*)\//g, '');
       this.image="assets/"+this.username+"."+ extension;
      
    }  
    //this.userService.uploadFile(this.file,this.image).subscribe(()=>{
      if(this.user){
        //admin adding new user
        this.userService.addUser(this.username,this.password,this.firstname,this.lastname,this.address,this.phone,this.email,this.image,"reader").subscribe(()=>{
          if(this.file){
            //upload picture
            this.userService.uploadFile(this.file,this.username).subscribe();
          }
          this.message="New user added";
          document.location.reload();
          
        });
      }
      else {
        //basic registration
        this.userService.register(this.username,this.password,this.firstname,this.lastname,this.address,this.phone,this.email,this.image,"reader").subscribe(()=>{
          if(this.file){
            //upload picture
            this.userService.uploadFile(this.file,this.username).subscribe();
          }
          this.message="Registration request succesfully sent";
          document.location.reload();
       })
      }
      
    //})
    
  })

 
 


}
onFileSelected(event) {
  //const element = event.currentTarget as HTMLInputElement;
  
  this.file= event.target.files[0];
  
}
}

