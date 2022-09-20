
import mongoose from "mongoose"

const Schema = mongoose.Schema;
let BookOfTheDay = new Schema({
    id:{
        type:Number
    },  //autoincremented
    
    date:{
        type:Date
    }
    
});

export default mongoose.model('BookOfTheDay',BookOfTheDay,'bookoftheday');