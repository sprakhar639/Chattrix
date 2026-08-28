import userModel from "../models/user.model.js";

async function myself(userId) {
  try{
    const user = await userModel.findById(userId);
    if (!user) {
      return res(404).json({message:"user not exist"});
    }
    return user
    
  } catch (error) {
    console.error(error);
  }
}
export { myself };
