import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";



export async function POST(request:Request) {
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                sucess: false,
                message:'user not found'
            },
            {status: 404})
        }
        // is user accepting messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {sucess: false,
                    message: 'user not accepting messages'
                },{status: 403}
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                sucess: true,
                message: "message sent sucessfully"
            },{status:200}
        )
    } catch (error) {
            console.log('Unable to add message', error)
            return Response.json(
                {sucess: false,
                    message: 'unable to add message'
                },{status: 403}
            )
    }
}