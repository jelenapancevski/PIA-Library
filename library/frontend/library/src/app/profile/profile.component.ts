import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { Borrowed } from '../models/borrowed';
import { Genre } from '../models/genre';
import { User } from '../models/user';
import { BooksService } from '../service/books.service';
import { UserService } from '../service/user.service';
import Chart from 'chart.js/auto'
import { BookInfo } from '../models/BookInfo';
import { R3TargetBinder } from '@angular/compiler';
//import { reduce } from 'rxjs';
import { Message } from '../models/message';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BooksService,private router: Router) { }


  showChartGenre(){
    this.bookService.genre().subscribe((genres:Genre[])=>{
      this.genres=genres;
      for( let genre of this.genres){
        if(!this.bookspergenre.has(genre.name)){
          this.bookspergenre.set(genre.name,0);
        }
        
      }
    let labels = [];
    let data = [];
     this.bookspergenre.forEach((value,key)=>{
      data.push(value);
      labels.push(key);
     });
     this.chart = new Chart("bookpergenre", {
        type: 'bar',
        data:{
          labels:labels,
          datasets:[{
          barPercentage: 0.5,
          barThickness: 50,
          maxBarThickness: 100,
          minBarLength: 0,
          data: data,
          backgroundColor: "#d0ccf6"
         } ]
        },
        options: {
          plugins: {
              title: {
                  display: true,
                  text: 'Number of books read by genre',
                  font:{
                    size:15,
                  },
                  color:"#483d8b"
              },
              legend:{
                display: false,
                  
              }
          },
         
          scales: {
            x: {
                ticks: {
                    font: {
                        size: 15,
                    },
                    color:"#483d8b"
                }
            }
        }
      } 
  
      
    });
  });
    
    
    }
  setBooksPerMonth(){
      this.bookService.monthlyBooks(this.user.username).subscribe((result:Borrowed[])=>{
        let labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        let data =[0,0,0,0,0,0,0,0,0,0,0,0];
        for(let book of result){
          let date = new Date(book.dateTaken).getMonth();
          data[date]++;
          }
          
          this.chartmonth = new Chart("bookpermonth", {
            type: 'bar',
            data:{
              labels:labels,
              datasets:[{
              barPercentage: 0.5,
              barThickness: 50,
              maxBarThickness: 100,
              minBarLength: 0,
              data: data,
              backgroundColor: "#d0ccf6"
             } ]
            },
            options: {
              plugins: {
                  title: {
                      display: true,
                      text: 'Number of books read in the last 12 months',
                      font:{
                        size:15,
                      },
                      color:"#483d8b"
                  },
                  legend:{
                    display: false,
                      
                  }
              },
             
              scales: {
                x: {
                    ticks: {
                        font: {
                            size: 15,
                        },
                        color:"#483d8b"
                    }
                }
            }
          } 
      
          
        });                
                      
      });
      
      
      
    }  
  setBooksPerGenre(){
    this.bookService.borrowedBooks(this.user.username).subscribe((result:BookInfo[])=>{
    
      for(let book of result){
        if(book.username==this.user.username){
          
            for( let genre of book.booksborrowed[0].genres){
                if( this.bookspergenre.has(genre)) this.bookspergenre.set(genre, this.bookspergenre.get(genre)+1);
                    else this.bookspergenre.set(genre,1);
                
                }
                       
                    }
    }
      this.showChartGenre();
    })
    
  }
  ngOnInit(): void {
    this.editpass=false;
    this.bookspergenre= new Map();
    this.user=JSON.parse(sessionStorage.getItem("user"));
    if(!this.user) this.router.navigate(['/']);
    else {
      if(this.user.type=="admin"){
        this.router.navigate(['/admin']);
        return;
      }
    }
    this.setBooksPerGenre();
    this.setBooksPerMonth();
  }
chartmonth:Chart
chart:Chart
genres:Genre[];
user: User;
editpass:boolean;
password1:string;
password2:string;
password:string;
message:string;
borrows: Borrowed[];
bookspergenre:Map<string,number>;
bookspermonth:Array<number>;
file: File;



changePassword(){
  this.message='';
  if(!this.password || !this.password1 || !this.password2){
   //alert('Please provide all the information necessary for changing password: old password and new password two times written');
    return;
  }
  if(this.password!=this.user.password) {
    this.message= "Incorrect password";
    return;
  }
  if(this.password1!=this.password2)  {
    this.message= "Passwords dont match";
    return;
  }
  
  if(!this.password1.match(/[A-Z]+/)) {
    this.message= "Password must include at least one upper case letter"; // bar jedno veliko slovo
    return;
  } 
  if(!this.password1.match(/\W+/)) {
    this.message= "Password must contain at least one special character"; // bar jedan specijalan karakter
    return;
  } 
  if(!this.password1.match(/[0-9]+/)){
    this.message="Password must contain at least one number";
    return;
  }
  if(!this.password1.match(/^[a-zA-Z]+/)) {
    this.message="Password must start with a letter";
    return;
  } 
  if ((this.password1.length<8) || (this.password1.length)>12) {
    this.message= "Password length inadequate"; 
    return;
  } 
  this.userService.changePassword(this.user.username,this.password1).subscribe(()=>{
     //alert("Password succesfully changed");
     sessionStorage.removeItem("user");
     document.location.reload();
  })
}
onFileSelected(event) {
  //const element = event.currentTarget as HTMLInputElement;
  
  this.file= event.target.files[0];
  
}
checkPassword(){
  //Provera lozinke
  if(!this.user.password.match(/[A-Z]+/)) {
    alert("Password must include at least one upper case letter"); // bar jedno veliko slovo
    return false;
  } 
  if(!this.user.password.match(/\W+/)) {
   alert("Password must contain at least one special character"); // bar jedan specijalan karakter
  return false;
  }
  if(!this.user.password.match(/^[a-zA-Z]+/)) {
    alert("Password must start with a letter");
    return false;
  }
  if(!this.user.password.match(/[0-9]+/)) {
    alert("Password must contain at least one number");
    return false;
  }
  if ((this.user.password.length<8) || (this.user.password.length)>12) { alert("Password length inadequate");
  return false;}
  return true;
  }
  
  checkEmail(){
    if(!this.user.email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)) {
      alert("Invalid email format");
      return false;
    } return true;
  }
  checkPhone(){
    if(!this.user.phone.match(/^06[0-9]{7,8}$/)){alert("Invalid phone format");
    return false;} 
    return true;
  }

saveChanges(){

let unchangeduser= JSON.parse(sessionStorage.getItem("user"));

//if(! this.checkPassword()) return;
//Provera email-a
if(!this.checkEmail()) return;
//Provera telefona
if(!this.checkPhone()) return;

let updateuser = new User();

  updateuser.username=null;
  if(this.user.firstname==unchangeduser.firstname){
    // Firstname the same
   updateuser.firstname=null;
  }
  else updateuser.firstname= this.user.firstname;

  if(this.user.lastname==unchangeduser.lastname){
    // Lastname the same
    updateuser.lastname=null;
  }
  else updateuser.lastname=this.user.lastname;

  if(this.user.email==unchangeduser.email){
    // Email the same
    updateuser.email=null;
  }else updateuser.email=this.user.email;

  if(this.user.phone==unchangeduser.phone){
    // phone the same
    updateuser.phone=null;
  }else updateuser.phone=this.user.phone;

  if((this.user.address.city!=unchangeduser.address.city )||(this.user.address.number!=unchangeduser.address.number)||(this.user.address.street!=unchangeduser.address.street)){
    // address not the same
    updateuser.address=this.user.address;
  } else  updateuser.address=null;

  updateuser.image=null;
  if(updateuser.address==null && updateuser.email==null && updateuser.firstname==null && updateuser.image==null && updateuser.lastname==null && updateuser.phone ==null && this.file==null ) return;

  if(this.file){
      let extension =this.file.type;
      extension=extension.replace(/(.*)\//g, '');
      updateuser.image="assets/"+unchangeduser.username+"."+ extension;
      
    }

  this.userService.updateInfo({
    "username": unchangeduser.username,
    "newusername":null,
    "password":updateuser.password,
    "firstname":updateuser.firstname,
    "lastname":updateuser.lastname,
    "address":updateuser.address,
    "phone":updateuser.phone,
    "email":updateuser.email,
    "image":updateuser.image,
  }).subscribe(()=>{
    if(this.file){
      //upload picture
      this.userService.uploadFile(this.file,unchangeduser.username).subscribe();
    }
    //alert("User info succesfully updated");
    sessionStorage.removeItem('user');
    this.userService.userInfo(unchangeduser.username).subscribe((user:User)=>{
      sessionStorage.setItem('user', JSON.stringify(user));
      document.location.reload();
    })
   
  })
}
}
