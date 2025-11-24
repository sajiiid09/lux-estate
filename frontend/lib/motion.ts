import { Variants } from "framer-motion"

export const fadeIn = (direction: "up" | "down" | "left" | "right", type: "tween" | "spring" | "inertia", delay: number, duration: number): Variants => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  }
}

export const staggerContainer = (staggerChildren: number, delayChildren: number): Variants => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren,
      },
    },
  }
}

export const textVariant = (delay: number): Variants => {
  return {
    hidden: {
      y: 50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
      },
    },
  }
}

export const smoothOpacity: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const zoomIn = (delay: number, duration: number): Variants => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  }
}

export const slideInLeft: Variants = {
  hidden: { x: -30, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const slideInRight: Variants = {
  hidden: { x: 30, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const scaleHover = (scale: number = 1.02, shadow: string = "0 15px 45px rgba(0,0,0,0.12)"): Variants => ({
  rest: { scale: 1, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" },
  hover: {
    scale,
    boxShadow: shadow,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
})

export const slideIn = (direction: "up" | "down" | "left" | "right", type: "tween" | "spring" | "inertia", delay: number, duration: number): Variants => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  }
}

export const staggerSlow: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1,
    },
  },
}

export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: 0.1,
    },
  },
}
