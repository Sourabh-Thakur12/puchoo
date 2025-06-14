import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length>0 ? usernameErrors.join(', ') : 'Invalid query params'
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message:'User already exists' 
                }, {status: 404}
            )
        }

        return Response.json(
                {
                    success: true,
                    message:'User is abvailable' 
                }, {status: 405}
            )
    } catch (error) {
        console.error("error validating username", error)
        return Response.json(
            {
                success: false,
                message: "Error validating username"
            },
            {
                status:  500
            }
        )
    }
}