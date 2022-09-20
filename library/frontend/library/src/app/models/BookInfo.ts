import { Author } from "./author";
import { Book } from "./book";

export class BookInfo{

    id:number;  //autoincremented
    username:string;
    dateTaken:Date;   //  null if reservation ,  not null if borrowed/ returned
    dateReturned:Date; //null if reservation/borrowed not null if returned
    days:number; 

    booksborrowed:Book;

}