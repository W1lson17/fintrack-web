import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  PiggyBank,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/features/auth/stores/auth.store";

/**
 * Navigation items for the sidebar
 */
const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: ROUTES.DASHBOARD,
  },
  {
    label: "Transactions",
    icon: ArrowLeftRight,
    to: ROUTES.TRANSACTIONS,
  },
  {
    label: "Categories",
    icon: Tag,
    to: ROUTES.CATEGORIES,
  },
  {
    label: "Saving Goals",
    icon: PiggyBank,
    to: ROUTES.SAVING_GOALS,
  },
] as const;

/**
 * SidebarContent component
 *
 * Shared between desktop sidebar and mobile drawer.
 */
const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { clearTokens } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate(ROUTES.LOGIN);
  };

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

      {/* User section */}
      <div className="px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-accent flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  U
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-left font-medium">
                My Account
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
    </div>
  );
};

/**
 * AppLayout
 *
 * Layout for authenticated routes.
 * - Desktop: fixed sidebar (260px) + main content area with top navbar
 * - Mobile: collapsible drawer triggered by hamburger menu
 */
export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="bg-card hidden w-65 shrink-0 flex-col border-r lg:flex">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
        <header className="bg-card flex h-14 shrink-0 items-center gap-4 border-b px-6">
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
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
