import { Address } from "./address";

export class User {
    username:string;
     
    password:string;
    
    firstname:String;
    
    lastname:String;
    
    address : Address;

    phone:String;
    
    email:String;

    image: String;
    
    type: String;
    
    status: String;  //pending active blocked 

    notborrowed:boolean;
   
};
