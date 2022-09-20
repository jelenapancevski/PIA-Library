import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  uri="http://localhost:4000";
  
  login(username,password){
    const data= {
      username:username,
      password:password
    }
    return this.http.post(`${this.uri}/users/login`,data);
  }
  register(username,password,firstname,lastname,address,phone,email,image,type){
    const data={
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      address:address,
      phone:phone,
      email:email,
      image:image,
      type: type,
      status: "pending"
    }
    return this.http.post(`${this.uri}/users/register`,data);
  }
  changePassword(username,password){
    return this.http.post(`${this.uri}/users/changePassword`,{"username":username,"newpassword":password});
  }
  checkavailability(username,email){
    return this.http.post(`${this.uri}/users/checkavailability`,{"username":username,"email":email});
  }
  uploadFile(file, username){
    const formData = new FormData();
   
    let filename= username+"."+file.type.replace(/(.*)\//g, '');
    formData.append("filename",filename);
    formData.append("file",file);
   
    return this.http.post(`${this.uri}/uploadFile`,formData );
  
  }
  allusers(){
    return this.http.get(`${this.uri}/users/allUsers`);
  }
  addUser(username,password,firstname,lastname,address,phone,email,image,type){
    const data={
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      address:address,
      phone:phone,
      email:email,
      image:image,
      type: type,
      status: "active"
    }
    return this.http.post(`${this.uri}/users/addUser`,data);
  }
  
  updateInfo(data){
    return this.http.post(`${this.uri}/users/updateInfo`,data);

  }
  acceptRequest(data){
    return this.http.post(`${this.uri}/users/acceptRequest`,data);
  }
  denyRequest(data){
    return this.http.post(`${this.uri}/users/denyRequest`,data);
  }
  deleteUser(username){
    return this.http.post(`${this.uri}/users/delete`,{"username":username});
  }
  updateType(username,type){
    return this.http.post(`${this.uri}/users/updateType`,{"username":username, 'type':type});

  }
  block(username){
    return this.http.post(`${this.uri}/users/block`,{"username":username});

  }
  deblock(username){
    return this.http.post(`${this.uri}/users/deblock`,{"username":username});

  }
  userInfo(username){
    return this.http.post(`${this.uri}/users/userInfo`,{"username":username});

  }
  
}
