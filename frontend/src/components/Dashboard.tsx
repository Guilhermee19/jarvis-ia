/**
 * Dashboard Component
 * Visualização principal com todos os painéis
 */
import { motion } from "framer-motion";
import ChatPanel from "./ChatPanel";
import CameraPanel from "./CameraPanel";
import StatusPanel from "./StatusPanel";

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full grid grid-cols-12 gap-6"
    >
      {/* Left Column - Chat */}
      <motion.div variants={itemVariants} className="col-span-4 h-full">
        <ChatPanel />
      </motion.div>

      {/* Middle Column - Camera */}
      <motion.div variants={itemVariants} className="col-span-5 h-full">
        <CameraPanel />
      </motion.div>

      {/* Right Column - Status */}
      <motion.div
        variants={itemVariants}
        className="col-span-3 h-full overflow-y-auto"
      >
        <StatusPanel />
      </motion.div>
    </motion.div>
  );
}
