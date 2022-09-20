import mongoose from "mongoose"

const Schema = mongoose.Schema;
let Borrowed = new Schema({
    id:{
        type:Number
    },  //autoincremented
    username:{
        type:String
    },
    dateTaken: {
        type:Date   //  null if reservation ,  not null if borrowed/ returned
    }
    ,
    dateReturned:{
        type:Date //null if reservation/borrowed not null if returned
    },

   days:{
    type: Number
   },
   reservation:{
    type: Boolean
   }
 
    
});

export default mongoose.model('Borrowed',Borrowed,'borrowed');



