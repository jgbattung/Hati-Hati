import * as z from "zod"

export const GroupValidation = z.object({
  name: z.string()
    .min(1, { message: 'Group name is required.' })
    .max(30, { message: 'Use up to 30 characters only.' })
})