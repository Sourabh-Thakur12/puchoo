import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User


    if(!session || !session.user){
            return Response.json({
            sucess: false,
            message: 'Not Authenticated' 
         }, {status: 401})
    }
    const userId = user._id;
    const{acceptMessages} = await request.json()


    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new:true}
        )        
        if(!updatedUser){

            return Response.json({
            sucess: false,
            message: 'Failed to update user stattus' 
         }, {status: 501})


            return Response.json({
            sucess: true,
            message: 'Message updated sucessfully',
            updatedUser
         }, {status: 401})

        }
    } catch (error) {
        console.log("falied to update user status")

        return Response.json({
            sucess: false,
            message: 'falied to update user status' 
         }, {status: 500})
    }
}

export async function GET(request:Request) {
    await dbConnect()
 
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User


    if(!session || !session.user){
            return Response.json({
            sucess: false,
            message: 'Not Authenticated' 
         }, {status: 401})
    }
    const userId = user._id;

    const founduser = await UserModel.findById(userId)

    if(!founduser){
        
            return Response.json({
            sucess: false,
            message: 'User Not Found' 
         }, {status: 404})
    }
   
}