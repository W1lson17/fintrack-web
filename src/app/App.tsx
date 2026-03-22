import { AppProviders } from "./providers";
import { AppRouter } from "./router";

/**
 * App component
 *
 * Root component — wraps the application with global providers
 * and renders the router.
 */
export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
