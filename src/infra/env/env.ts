import { z } from "zod"

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    SA_KEY: z.string()
})

export type Env = z.infer<typeof envSchema>

