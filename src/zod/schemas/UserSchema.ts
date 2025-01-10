import { z } from "zod";

export const UserSchema = z.object({
	id: z.string(),
	username: z.string(),
	isdarkmode: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
