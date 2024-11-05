import {z} from "zod";
const urlSchema = z.string().url()

export const createWidgetSchema = z.object({
    name: z.string().min(3, "Name is too short").max(30,"Name is too long"),
    trustedOrigins: z.array(urlSchema).min(1, "Atleast one trusted origin is required").max(5, "Trusted Origin cant be more than 5").refine((urls) => new Set(urls).size === urls.length, {
        message: "Duplicate Origins are not allowed"
      }),
    isActive: z.boolean()
})

export type CreateWidgetType = z.infer<typeof createWidgetSchema>