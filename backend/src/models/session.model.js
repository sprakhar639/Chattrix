import mongoose from 'mongoose'


const sessionSchema=new mongoose.Schema({
       userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
       },
       refreshTokenHash:{
        type:String,
        required:true
       },
       ip:{
         type:String,
         required:true
       },
       userAgent:{
         type:String,
        required:true
       },
       revoked:{
        type:Boolean,
        default:false
       }
})

const sessionModel=mongoose.model("session",sessionSchema)

export default sessionModel;