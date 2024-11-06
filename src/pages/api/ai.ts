"use server";
import { config } from "dotenv";
config();

import { z } from "zod";
import OpenAI from "openai";
import { formSchema } from "./schemas";

export async function generateTripPlan(formData: z.infer<typeof formSchema>) {
    console.log("generating the trip plan");
    console.log(formData);    
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { startDate, endDate, budget, interests, location } = formData;

    const prompt = `
    I am planning a local trip around ${location} from ${startDate} to ${endDate}.

    My budget is $${budget} and I am interested in ${interests.join(", ")}.
    `;

    // const response = await openai.chat.completions.create({
    //     model: "gpt-4o-mini",
    //     messages: [
    //         { role: "system", content: "You are a helpful assistant." },
    //         {
    //             role: "user",
    //             content: "Write a haiku about recursion in programming.",
    //         },
    //     ],
    // });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      }),
    });

    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.log("Error in generateTripPlan", error);
    throw error;
  }
}
