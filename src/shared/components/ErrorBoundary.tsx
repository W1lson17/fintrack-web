import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component
 *
 * Catches JavaScript errors anywhere in the child component tree.
 * Handles dynamic import failures (lazy loading chunks) gracefully
 * by offering a reload option instead of showing a blank screen.
 *
 * Must be a class component — React error boundaries require lifecycle
 * methods (getDerivedStateFromError, componentDidCatch) not available in hooks.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  /**
   * Checks if the error is a dynamic import failure.
   * These occur when a lazy-loaded chunk fails to fetch —
   * usually due to a new deployment invalidating old chunk URLs.
   */
  private isDynamicImportError(error: Error | null): boolean {
    return (
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Importing a module script failed") ||
      false
    );
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDynamicImport = this.isDynamicImportError(this.state.error);

      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md space-y-6 text-center"
          >
            <div className="flex justify-center">
              <div className="bg-destructive/10 rounded-full p-4">
                <AlertTriangle className="text-destructive size-10" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                {isDynamicImport ? "Update Available" : "Something went wrong"}
              </h2>
              <p className="text-muted-foreground">
                {isDynamicImport
                  ? "A new version of the app is available. Please reload to get the latest version."
                  : "An unexpected error occurred. Try reloading the page or going back."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isDynamicImport && (
                <Button variant="outline" onClick={this.handleReset}>
                  Try again
                </Button>
              )}
              <Button onClick={this.handleReload}>
                <RefreshCw className="mr-2 size-4" />
                Reload page
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
