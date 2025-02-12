"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, type ReactNode, useState } from "react"

interface BoxRevealProps {
  children: ReactNode
  width?: "fit-content" | "100%"
  boxColor?: string
  duration?: number
}

export const BoxReveal = ({
  children,
  width = "fit-content",
  boxColor = "#5046e6",
  duration = 0.5,
}: BoxRevealProps) => {
  const [isClient, setIsClient] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div style={{ width }}>{children}</div>
  }

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 75 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration, delay: 0.25 }}
      >
        {children}
      </motion.div>

      <motion.div
        initial={{ left: 0 }}
        animate={{ left: "100%" }}
        transition={{ duration: duration, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
        }}
      />
    </div>
  )
}

