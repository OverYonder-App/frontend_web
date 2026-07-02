"use client";

import { useForm } from "react-hook-form";
import type { Organization, OrganizationInsert } from "../api";
import { createClub, updateClub } from "../api";

interface Props {
  club?: Organization;
  onSaved: (club: Organization) => void;
  onCancel: () => void;
}

export default function ClubForm({ club, onSaved, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationInsert>({
    defaultValues: {
      name: club?.name ?? "",
      description: club?.description ?? "",
      logo_url: club?.logo_url ?? "",
    },
  });

  const onSubmit = async (values: OrganizationInsert) => {
    try {
      const saved = club
        ? await updateClub(club.organization_id, values)
        : await createClub(values);
      onSaved(saved);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-[#624080] disabled:opacity-50"
        >
          {club ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
