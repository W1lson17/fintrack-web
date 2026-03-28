import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateNameSchema,
  type UpdateNameFormValues,
} from "@/features/profile/schemas/profile.schemas";

interface UpdateNameFormProps {
  currentName: string;
  isLoading?: boolean;
  onSubmit: (data: UpdateNameFormValues) => void;
}

/**
 * UpdateNameForm component
 *
 * Form for updating the authenticated user's name.
 * Uses React Hook Form + Zod for validation.
 * Pre-fills current name as default value.
 * Submit button disabled until form is valid.
 */
export const UpdateNameForm = ({
  currentName,
  isLoading = false,
  onSubmit,
}: UpdateNameFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    mode: "onChange",
    defaultValues: {
      name: currentName,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g. John Doe"
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
};
