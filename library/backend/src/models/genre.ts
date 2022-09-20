import mongoose from "mongoose"

const Schema = mongoose.Schema;
let Genre = new Schema({
    /*id:{
        type:Number
    },*/  //autoincremented
    name:{
        type:String
    }
 
    
});

export default mongoose.model('Genre',Genre,'genre');