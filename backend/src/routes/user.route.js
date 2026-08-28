import {Router} from 'express'
import {getMe}  from '../controllers/user.controller.js'
import  token from '../middlewares/auth.middleware.js'

const router=Router()

router.get("/me",token,getMe)


export default router