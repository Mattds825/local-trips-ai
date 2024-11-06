import { z } from "zod";

// define the form schema using zod
export const formSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    budget: z.number().min(0),
    interests: z.array(z.string()).min(1),
    location: z.string().optional(),
  });