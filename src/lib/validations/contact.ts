import * as z from "zod"

export const ContactValidation = z.object({
  email: z.string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email address' })
});