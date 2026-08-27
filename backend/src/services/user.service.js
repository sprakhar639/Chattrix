 import userModel from "../models/user.model.js";
 import bcrypt from "bcrypt";
 async function register({username,email,password}){
 const isalreadyRegistered = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isalreadyRegistered) {
       throw new Error("User already Exist")
    }

    const hash=await bcrypt.hash(password,10)
    

    const user=await  userModel.create({
        username,email,password:hash
    })

    return user;
}


export {register}