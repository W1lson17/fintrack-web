import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * AuthLayout
 *
 * Layout for public routes (login, register).
 * Split screen design:
 * - Left side: branding panel with gradient background (hidden on mobile)
 * - Right side: centered form content
 */
export const AuthLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side — branding panel */}
      <div className="bg-primary text-primary-foreground hidden flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-2">
          <div className="bg-primary-foreground/20 flex size-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">F</span>
          </div>
          <span className="text-lg font-semibold">Fintrack</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-4xl leading-tight font-bold">
            Take control of your finances
          </h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Track income, expenses, and saving goals — all in one place.
          </p>
        </motion.div>

        <p className="text-primary-foreground/50 text-sm">
          © {new Date().getFullYear()} Fintrack. All rights reserved.
        </p>
      </div>

      {/* Right side — form content */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo — only visible on small screens */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">
                F
              </span>
            </div>
            <span className="text-lg font-semibold">Fintrack</span>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};
