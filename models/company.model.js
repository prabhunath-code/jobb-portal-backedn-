import mongoose from "mongoose";

const companyScehma=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        
    },
    website:{
        type:String,
        
    },
    location:{
        type:String,
        
    },
    logo:{
        type:String,

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        reuired:true
    }
},{timestamps:true})

export const Company =mongoose.model("Company",companyScehma)

