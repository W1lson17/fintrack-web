import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  PiggyBank,
  LogOut,
  Menu,
  ChevronRight,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/shared/constants/routes";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { useProfile } from "@/features/profile/hooks/useProfile";

/**
 * Navigation items for the sidebar
 */
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { label: "Transactions", icon: ArrowLeftRight, to: ROUTES.TRANSACTIONS },
  { label: "Categories", icon: Tag, to: ROUTES.CATEGORIES },
  { label: "Saving Goals", icon: PiggyBank, to: ROUTES.SAVING_GOALS },
] as const;

/**
 * ThemeToggle component
 *
 * Toggles between light and dark mode via next-themes.
 * Shows Sun icon in dark mode, Moon icon in light mode.
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="size-5 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  );
};

/**
 * SidebarContent component
 *
 * Shared between desktop sidebar and mobile drawer.
 * Contains logo and navigation only — user actions moved to navbar.
 */
const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  return (
    <div className="flex h-full flex-col py-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-6">
        <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
          <span className="text-primary-foreground text-sm font-bold">F</span>
        </div>
        <span className="text-lg font-semibold">Fintrack</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="size-3.5 shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Separator className="my-4" />

      {/* App version */}
      <p className="text-muted-foreground px-6 text-xs">Fintrack v1.0.0</p>
    </div>
  );
};

/**
 * AppLayout
 *
 * Layout for authenticated routes.
 * - Desktop: fixed sidebar (260px) + main content area with top navbar
 * - Mobile: collapsible drawer triggered by hamburger menu
 * - Navbar: page title breadcrumb, theme toggle and user dropdown
 */
export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = usePageTitle();
  const { data: profile } = useProfile();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="bg-card hidden w-65 shrink-0 flex-col border-r lg:flex">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
        <header className="bg-card flex h-14 shrink-0 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-65 p-0">
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Page title */}
            {pageTitle && (
              <h1 className="text-base font-semibold">{pageTitle}</h1>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {profile?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(ROUTES.PROFILE)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
