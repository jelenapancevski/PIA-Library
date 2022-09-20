
import mongoose from "mongoose"

const Schema = mongoose.Schema;
let User = new Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    firstname:{
        type:String},
    lastname:{
        type:String
    },
    address:{
        street: {
            type: String
        },
        number: {
        type: Number
        },
        city :{
            type: String
        }

    },
    phone: {
        type: String
    },
    email:{
        type:String
    },
    image: {
        type:String
    },
    type:{
        type: String        // reader, moderator, admin
    },
    status:{
        type: String  //pending active blocked
    }
    
});

export default mongoose.model('User',User,'users');
