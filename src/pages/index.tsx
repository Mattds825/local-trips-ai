"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-[100vh] bg-gradient-to-tl from-purple-100 via-white to-slate-100 flex justify-center items-center">
      <HeroHighlight className="flex flex-col gap-24">
        <h1 className="text-3xl text-green-500 font-black relative text-center">
          L📍cal Trips
        </h1>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Have a some time off? Plan a short getaway, remember{" "}
          <Highlight className="text-black dark:text-white">
            you don't have to go far
          </Highlight>
        </motion.h1>
 
        <Link className="mx-auto" href="/travel-planner/page">
          <Button className="mx-auto text-3xl text-slate-800 hover:tracking-widest transition-all duration-300" variant="link">
            start
          </Button>
        </Link>
      </HeroHighlight>
    </main>
  );
}
