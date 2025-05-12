import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charecter")
    .max(20, "Username must not exceed 20 charecter")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid Username")


export const emailValidation = z.object({
        username: usernameValidation,
        email : z.string().email({message: "Invalid email"}),
        password: z.string().min(6, "must be atleast 6 char")
})