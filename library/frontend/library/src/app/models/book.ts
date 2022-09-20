import { Author } from "./author";
import { Comment } from "./comment";
import { Genre } from "./genre";

export class Book{
    id:number;  //autoincremented
    title:string;
    authors:Array<Author>;
    genres: Array<string>;
    publisher:string;
    yearPublished:number;
    language:string;
    image:string;
    status:string; //pending active
    username:string;     // predlozio;
    quantity: number;
    days:number;

    comments:Array<Comment>;

    //Detalji knjige i izmena
    allauthors:string;
    selectedgenres: Array<string>;
    notborrowed: boolean;
}