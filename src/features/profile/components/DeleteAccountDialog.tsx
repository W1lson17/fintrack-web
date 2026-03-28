import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteAccountSchema,
  type DeleteAccountFormValues,
} from "@/features/profile/schemas/profile.schemas";

interface DeleteAccountDialogProps {
  isLoading?: boolean;
  onConfirm: (data: DeleteAccountFormValues) => void;
}

/**
 * DeleteAccountDialog component
 *
 * Confirmation dialog for account deletion.
 * Requires password confirmation before proceeding — prevents accidental deletions.
 * Uses React Hook Form + Zod for password validation.
 * Submit button disabled until form is valid.
 */
export const DeleteAccountDialog = ({
  isLoading = false,
  onConfirm,
}: DeleteAccountDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    mode: "onChange",
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 size-4" />
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All your data will be permanently
            deleted. Please enter your password to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
          {/* Password confirmation */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete account"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
