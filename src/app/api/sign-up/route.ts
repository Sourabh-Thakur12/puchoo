import dbConnect from "@/lib/dbConnect";
import { sendVerfivationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request){
    await dbConnect();

    try {
       const {username, email, password} = await request.json() 
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