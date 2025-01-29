import { z } from "zod";

export const Theme = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const NodeEnv = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];
export type NodeEnv = (typeof NodeEnv)[keyof typeof NodeEnv];

const accountSchema = z.object({
  name: z.string(),
  publicKey: z.string(),
  secretKey: z.string(),
});

export type AccountData = z.infer<typeof accountSchema>;

export type { User } from "@supabase/supabase-js";
