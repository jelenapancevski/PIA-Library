export class Borrowed{
    id:number;  //autoincremented
    username:string;
    dateTaken:Date;   //  null if reservation ,  not null if borrowed/ returned
    dateReturned:Date; //null if reservation/borrowed not null if returned
    days:number; 
    reservation:boolean;

    borrowcount:number;

    //Za prikaz zaduzenih knjiga
    image:string;
    authors:string;
    title: string;
    overdue:boolean;
    userdays:number;
    extended:boolean;

    //Za prikaz istorije zaduzivanja
    dateTakenString:string;
    dateReturnedString:string;
    authorlastname:string;
};




