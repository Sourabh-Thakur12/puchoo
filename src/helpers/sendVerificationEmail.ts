import { resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { log } from "node:console";

export async function sendVerfivationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Puchoo | email Verification code",
            react: VerificationEmail({username, otp : verifyCode})

        })

            return {sucess: true , message: 'Verification Email Sent Sucessfully'}
    } catch (emailError) {
        
            console.log("Error Sending Verification Email", emailError);
            
            return {sucess: false , message: 'Error sending Verification Email'}
    }
    
}