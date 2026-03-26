import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

/**
 * NotFoundPage
 *
 * Displayed when the user navigates to a route that does not exist.
 * Provides navigation back to dashboard or previous page.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md space-y-6 text-center"
      >
        {/* Error code */}
        <div className="space-y-2">
          <h1 className="text-primary text-8xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <MoveLeft className="mr-2 size-4" />
            Go back
          </Button>
          <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
            <Home className="mr-2 size-4" />
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
