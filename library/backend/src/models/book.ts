
import mongoose from "mongoose"

const Schema = mongoose.Schema;
let Book = new Schema({
    id:{
        type:Number
    },  //autoincremented
    title:{
        type:String
    },
    authors:[
        {
            firstname:{
                type:String
            },
            lastname: {
                type:String
            }
        }
    ],
    genres:[
        {   
                type:String
            
            
        }
    ],
    publisher:{
        type:String
    },
    yearPublished:{
        type:Number
    },
    language:{
        type:String
    },
    image:{
        type:String
    },
    status: {
        type:String //pending active
    },
    username: {
        type:String     // predlozio
    },
    quantity:{
        type: Number
    },
    days: {
        type:Number
    },

    comments:[
        {
            username:{
                type:String
            },
            comment:{
                type:String
            },
            review:{
                type:Number
            },
            date:{
                type:Date
            },
            edited:{
                type:Boolean
            }
        }
    ]
});

export default mongoose.model('Book',Book,'books');