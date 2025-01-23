import * as z from "zod"

export const ContactValidation = z.object({
  name: z.string()
    .min(1, { message: 'Name is required.' })
    .max(30, { message: 'Name must be 30 characters or fewer.' }),
  email: z.string().min(1, { message: 'Email is required.' })
});