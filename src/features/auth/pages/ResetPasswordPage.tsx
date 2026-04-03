import { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useResetPassword } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";

/**
 * ResetPasswordPage
 *
 * Public page for resetting the user's password using a token from the URL.
 * Redirects to login if no token is present in the URL.
 * Uses React Hook Form + Zod for form validation.
 * Rendered inside AuthLayout.
 */
export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { mutate: resetPassword, isPending } = useResetPassword();

  // Redirect to login if no token in URL — prevents accessing page directly
  useEffect(() => {
    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) return;
    console.log("TOKEN:", token); // 👈 agregar
    console.log("DATA:", data); // 👈 agregar
    resetPassword({ token, newPassword: data.newPassword });
  };

  if (!token) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-destructive text-xs">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-muted-foreground text-center text-sm">
        Remember your password?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary font-medium hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
};
