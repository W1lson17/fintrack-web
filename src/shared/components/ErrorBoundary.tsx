import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

/**
 * ErrorBoundary component
 *
 * Catches JavaScript errors anywhere in the child component tree.
 * Distinguishes between three error scenarios:
 * 1. Network offline — server unreachable
 * 2. Dynamic import failure — new deployment invalidated chunk URLs
 * 3. General render error — unexpected application error
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
    this.state = { hasError: false, error: null, isOffline: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check network connectivity at the moment the error occurs
    const isOffline = !navigator.onLine;
    return { hasError: true, error, isOffline };
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
    this.setState({ hasError: false, error: null, isOffline: false });
  };

  private getErrorContent() {
    const { error, isOffline } = this.state;
    const isDynamicImport = this.isDynamicImportError(error);

    // Network offline
    if (isOffline) {
      return {
        icon: <WifiOff className="text-muted-foreground size-10" />,
        iconBg: "bg-muted",
        title: "No internet connection",
        description: "Please check your connection and try again.",
        showReset: true,
        showReload: true,
      };
    }

    // Dynamic import failure — server down or new deployment
    if (isDynamicImport) {
      return {
        icon: <RefreshCw className="text-primary size-10" />,
        iconBg: "bg-primary/10",
        title: "Update available",
        description:
          "A new version of the app is available. Please reload to get the latest version.",
        showReset: false,
        showReload: true,
      };
    }

    // General render error
    return {
      icon: <AlertTriangle className="text-destructive size-10" />,
      iconBg: "bg-destructive/10",
      title: "Something went wrong",
      description:
        "An unexpected error occurred. Try reloading the page or going back.",
      showReset: true,
      showReload: true,
    };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const content = this.getErrorContent();

      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md space-y-6 text-center"
          >
            <div className="flex justify-center">
              <div className={`rounded-full p-4 ${content.iconBg}`}>
                {content.icon}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{content.title}</h2>
              <p className="text-muted-foreground">{content.description}</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              {content.showReset && (
                <Button variant="outline" onClick={this.handleReset}>
                  Try again
                </Button>
              )}
              {content.showReload && (
                <Button onClick={this.handleReload}>
                  <RefreshCw className="mr-2 size-4" />
                  Reload page
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
