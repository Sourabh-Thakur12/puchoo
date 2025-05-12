import {z} from "zod";

export const verifyValidation = z.object({
    code: z.string().length(6, "code must be atleast 6 char")
})

