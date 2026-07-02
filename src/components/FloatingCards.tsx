"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

const cards = Array.from({ length: 12 });

export default function FloatingCards() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const relX = (e.clientX - left) / width;
      const relY = (e.clientY - top) / height;
      x.set(relX);
      y.set(relY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-[0] overflow-hidden bg-white/80"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="columns-1 sm:columns-2 md:columns-3 gap-[10vw] p-10"
      >
        {cards.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mb-6 break-inside-avoid bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-xl overflow-hidden w-full flex flex-col  content-center transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="h-40 w-full overflow-hidden">
              <Image
                src={`/images/sample-event-${(i % 3) + 1}.jpg`}
                alt="Event Banner"
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between p-4 text-left text-[#333]">
              <div>
                <h3 className="text-lg font-semibold leading-tight mb-1">
                  {
                    [
                      "Open Mic Night 🎤",
                      "Fall Club Fair 🍂",
                      "Women in STEM Mixer 👩‍🔬",
                      "Yote Leadership Summit 🧠",
                      "Art & Soul Showcase 🎨",
                    ][i % 5]
                  }
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {
                    [
                      "Share your voice or enjoy live performances from fellow students in a cozy campus cafe setting.",
                      "Meet 40+ student clubs and grab free food, merch, and maybe your next best friend.",
                      "An evening for aspiring female engineers and scientists to network and connect with alumni.",
                      "A one-day leadership bootcamp hosted by top student leaders and invited speakers.",
                      "Local and student artists showcase their work in an immersive multimedia exhibition.",
                    ][i % 5]
                  }
                </p>
              </div>
              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  📅 Friday, Sept 6 • 6:00PM
                </p>
                <p className="text-xs text-gray-500">📍 McCain Student Union</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
