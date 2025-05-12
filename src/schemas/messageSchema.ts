import { z } from "zod";

export const messageValidation = z.object({
    content : z.string()
                .min(10, {message: "message must be atleast 10 char long"})
                .max(300, {message: "Content should not exceed 300 chars"})
})