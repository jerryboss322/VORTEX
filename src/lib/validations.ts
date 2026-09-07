import { z } from "zod";

export const bookingCodeSchema = z.string().trim().min(2).max(50);
export const bookmakerSchema = z.string().trim().min(2).max(50);
export const oddsSchema = z.coerce.number().positive().max(1000).optional().nullable();
export const confidenceSchema = z.coerce.number().int().min(0).max(100).optional().nullable();
export const noteSchema = z.string().trim().max(500).optional().nullable();

export const tipSchema = z.object({
  bookingCode: bookingCodeSchema,
  bookmaker: bookmakerSchema,
  odds: oddsSchema,
  confidence: confidenceSchema,
  note: noteSchema,
  status: z.enum(["PENDING", "WON", "LOST", "CANCELLED"]).optional().default("PENDING"),
});

export const tipBatchSchema = z.object({
  games: z.array(tipSchema).min(1).max(10),
});

export const submissionSchema = tipSchema;

export const userCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  role: z.enum(["ADMIN", "CONTRIBUTOR"]).default("CONTRIBUTOR"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type TipInput = z.infer<typeof tipSchema>;
