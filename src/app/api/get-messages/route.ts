import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // learn aggregation pipeine mongodb
        const user = await UserModel.aggregate([
            { $match: {id: userId}},
            { $unwind: '$messages'},
            { $sort: {'$messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            
            return Response.json({
            sucess: false,
            message: 'User not found' 
         }, {status: 404})
        }

            return Response.json({
            sucess: true,
            messages: user[0].messages
         }, {status: 200})

    } catch (error) {
        console.log('internal server error::', error)
        return Response.json({
        sucess: false,
        messages: 'internal server erroe'
     }, {status: 400})
        
    }
 
}