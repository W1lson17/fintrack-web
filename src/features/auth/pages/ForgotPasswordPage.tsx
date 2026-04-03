import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";

/**
 * ForgotPasswordPage
 *
 * Public page for requesting a password reset email.
 * Uses React Hook Form + Zod for form validation.
 * Rendered inside AuthLayout.
 */
export const ForgotPasswordPage = () => {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data);
  };

  // Show success state after submission — prevents user enumeration
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground text-sm">
            If an account exists for that email, we've sent a password reset
            link. Check your inbox.
          </p>
        </div>
        <p className="text-muted-foreground text-center text-sm">
          <Link
            to={ROUTES.LOGIN}
            className="text-primary font-medium hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
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
