import dbConnect from "@/lib/dbConnect";
import { sendVerfivationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt, { hash } from "bcryptjs";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    try {
       const {username, email, password} = await request.json() 
      const existingUserVerifiedByUsername = await UserModel.findOne({
         username,
         isVerified : true
       })

       if(existingUserVerifiedByUsername){
         return Response.json({
            sucess:false,
            message: 'Username already taken'
         },{status: 400})
       }

       const existingUserByEmail = await UserModel.findOne({email })
       const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

       if(existingUserByEmail){
         if(existingUserByEmail.isVerified){
          return Response.json({
            sucess: false,
            message: "User alrady exist with this email"
         }, {status: 400})  
         }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword,
            existingUserByEmail.verifyCode = verifyCode,
            existingUserByEmail.vetifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
         }
       }else{
         const hashedPassword = await bcrypt.hash(password, 10)
         const expiryDate = new Date() 
         expiryDate.setHours(expiryDate.getHours() + 1)

         const newUser = new UserModel({
            userName:username,
            email,
            password: hashedPassword,
            verifyCode,
            vetifyCodeExpiry: expiryDate,
            isVerified : false,
            isAcceptingMessage:true,
            messages: []
         })
            await newUser.save()
       }
      const emailResponse =  await sendVerfivationEmail(email, username, verifyCode)

      if(!emailResponse.sucess){
         return Response.json({
            sucess: false,
            message: email.message
         }, {status: 500})
      }

         return Response.json({
            sucess: true,
            message: 'User Registerd, Verify Email now'
         }, {status: 201})

    } catch (error) {
       console.log('Error registeringuser ', error)
       
       return Response.json({
        sucess: false,
        message: 'error registering user'
       },
       {
        status: 500
       }
    )
    }
}