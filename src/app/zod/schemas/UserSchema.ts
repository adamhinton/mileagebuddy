import { z } from "zod";

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	isDarkMode: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;