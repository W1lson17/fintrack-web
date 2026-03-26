import { Loader2 } from "lucide-react";

/**
 * PageLoader component
 *
 * Full-page loading indicator used as Suspense fallback
 * while lazy-loaded page chunks are being fetched.
 */
export const PageLoader = () => {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <Loader2 className="text-muted-foreground size-8 animate-spin" />
    </div>
  );
};
