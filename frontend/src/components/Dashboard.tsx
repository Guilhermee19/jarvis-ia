"use client";

import { motion } from "framer-motion";
import { Button } from "./ui";
import { MicOff } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [isMicOn, setIsMicOn] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full h-full bg-radial from-[#0d1727] from-30% to-[#060a0f] to-80% backdrop-blur-lg flex justify-center items-center"
    >
      <div className="absolute text-sm border-2 border-primary/50 aspect-square flex justify-center items-center rounded-full p-10">
        <div className="font-light p-0 m-0 text-2xl">J A R V I S</div>
      </div>

      <div className="fixed bottom-0 flex justify-center items-center gap-6 w-full px-6 py-4">
        <Button
          variant="ghost"
          className="col-span-2 h-max cursor-pointer"
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <MicOff size={18} /> : <MicOff size={18} />}
        </Button>
      </div>
    </motion.div>
  );
}
