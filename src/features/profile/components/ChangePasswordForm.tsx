import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/profile/schemas/profile.schemas";

interface ChangePasswordFormProps {
  isLoading?: boolean;
  onSubmit: (data: ChangePasswordFormValues) => void;
}

/**
 * ChangePasswordForm component
 *
 * Form for changing the authenticated user's password.
 * Uses React Hook Form + Zod for validation.
 * confirmPassword is validated client-side only — not sent to API.
 * Submit button disabled until form is valid.
 */
export const ChangePasswordForm = ({
  isLoading = false,
  onSubmit,
}: ChangePasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Enter your current password"
          disabled={isLoading}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-destructive text-xs">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          disabled={isLoading}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-destructive text-xs">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm new password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          disabled={isLoading}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-xs">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Changing...
          </>
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  );
};
