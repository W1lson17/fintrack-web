import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateNameForm } from "@/features/profile/components/UpdateNameForm";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";
import { DeleteAccountDialog } from "@/features/profile/components/DeleteAccountDialog";
import {
  useProfile,
  useUpdateName,
  useChangePassword,
  useDeleteAccount,
} from "@/features/profile/hooks/useProfile";
import type {
  UpdateNameFormValues,
  ChangePasswordFormValues,
  DeleteAccountFormValues,
} from "@/features/profile/schemas/profile.schemas";

/**
 * ProfilePage
 *
 * Displays the authenticated user's profile information.
 * Allows updating name, changing password and deleting account.
 */
export const ProfilePage = () => {
  const { data: profile, isLoading } = useProfile();
  const { mutateAsync: updateName, isPending: isUpdatingName } =
    useUpdateName();
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const { mutateAsync: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();

  const handleUpdateName = async (data: UpdateNameFormValues) => {
    await updateName(data);
  };

  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const handleDeleteAccount = async (data: DeleteAccountFormValues) => {
    await deleteAccount(data);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Profile</CardTitle>
          <CardDescription>
            {isLoading ? <Skeleton className="h-4 w-48" /> : profile?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <UpdateNameForm
              currentName={profile?.name ?? ""}
              isLoading={isUpdatingName}
              onSubmit={handleUpdateName}
            />
          )}
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm
            isLoading={isChangingPassword}
            onSubmit={handleChangePassword}
          />
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive text-base font-medium">
            Danger zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <DeleteAccountDialog
            isLoading={isDeletingAccount}
            onConfirm={handleDeleteAccount}
          />
        </CardContent>
      </Card>
    </div>
  );
};
