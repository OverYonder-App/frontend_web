"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Combobox } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { fetchClubs, type Organization } from "@/features/organizations/api";
import { type EventRecord } from "@/features/events/api";
import { type EventFormValues } from "@/constants/defaults";
import { Toast } from "@/components/Toast";
import LocationPicker from "@/components/map/LocationPicker";

interface EditEventFormProps {
  /** The event being edited */
  event: EventRecord;
  /** Called when the form should close */
  onClose?: () => void;
  /** Called with the updated event after a successful save */
  onSaved?: (event: EventRecord) => void;
  /** Called after the event is deleted */
  onDeleted?: (id: string) => void;
}

function formatEventDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${format(startDate, "EEEE, MMMM d, yyyy")}, from ${format(
    startDate,
    "h:mm a",
  )} to ${format(endDate, "h:mm a")}`;
}

export default function EditEventForm({
  event,
  onClose,
  onSaved,
  onDeleted,
}: EditEventFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<EventFormValues>({
    mode: "onChange",
    defaultValues: {
      title: event.title ?? "",
      description: event.description ?? "",
      organization_id: event.organization_id ?? "",
      imageFile: null,
      location: {
        lat: event.latitude ?? 0,
        lng: event.longitude ?? 0,
      },
      address: event.address ?? "",
      start_date: event.start_date
        ? new Date(event.start_date).toISOString().slice(0, 16)
        : "",
      end_date: event.end_date
        ? new Date(event.end_date).toISOString().slice(0, 16)
        : "",
    },
  });
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [clubs, setClubs] = useState<Organization[]>([]);
  const [clubQuery, setClubQuery] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [currentImage, setCurrentImage] = useState<string>(event.image_url || "");

  const updateLocation = useCallback(
    (loc: { lat: number; lng: number }) => {
      setValue("location", loc, { shouldValidate: true });
    },
    [setValue],
  );

  const location = useWatch({ control, name: "location" });
  const address = useWatch({ control, name: "address" });

  useEffect(() => {
    fetchClubs({ search: clubQuery }).then(({ clubs }) => setClubs(clubs));
  }, [clubQuery]);

  useEffect(() => {
    register("location", { required: true });
    register("address");
  }, [register]);

  const watched = useWatch({ control });

  const onSubmit = async (data: EventFormValues) => {
    setSubmitting(true);
    try {
      let imageUrl = currentImage;
      if (data.imageFile?.[0]) {
        const file = data.imageFile[0];
        const ext = file.name.split(".").pop();
        const filePath = `${event.institution_id}/events/${event.event_id}/banner.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("oy-media")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("oy-media")
            .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 100);
        if (signedUrlError) throw signedUrlError;
        imageUrl = signedUrlData.signedUrl;
      }

      const res = await fetch(`/api/events/${event.event_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          start_date: new Date(data.start_date).toISOString(),
          end_date: new Date(data.end_date).toISOString(),
          organization_id: data.organization_id,
          latitude: data.location.lat,
          longitude: data.location.lng,
          address: data.address,
          image_url: imageUrl,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const { event: updated } = await res.json();
      onSaved?.(updated);
      if (typeof router.refresh === "function") router.refresh();
      setToast({ msg: "Event updated", type: "success" });
    } catch (e) {
      setToast({ msg: String(e), type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  async function handleDelete() {
    if (!confirm("Delete this event?")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${event.event_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      onDeleted?.(event.event_id);
      setToast({ msg: "Event deleted", type: "success" });
      onClose?.();
    } catch (e) {
      setToast({ msg: String(e), type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitles = ["Details", "Location", "Schedule", "Review"];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="p-4 bg-gray-100 rounded-xl shadow"
    >
      <h1 className="text-xl font-semibold mb-2">Edit Event</h1>
      <p className="text-sm text-gray-600 mb-4">
        Step {step} of 4: {stepTitles[step - 1]}
      </p>
      <div className="flex gap-2 mb-4">
        {stepTitles.map((title, i) => (
          <button
            key={title}
            type="button"
            onClick={() => setStep(i + 1)}
            className={`px-3 py-1 rounded-full text-xs ${
              step === i + 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
            aria-label={`Go to ${title}`}
          >
            {title}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Details</h2>
          <div>
            <label className="block text-sm">Event Image</label>
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <>
                  {currentImage ? (
                    <div className="relative inline-block">
                      <Image
                        src={currentImage}
                        alt="Preview"
                        className="h-32 w-48 object-cover rounded"
                        width={192}
                        height={128}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentImage("");
                          field.onChange(null);
                        }}
                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <label
                        htmlFor="file-input"
                        className="absolute bottom-1 left-1 bg-white/80 px-2 py-1 rounded text-xs cursor-pointer"
                      >
                        Change
                      </label>
                    </div>
                  ) : (
                    <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e.target.files);
                          const file = e.target.files?.[0];
                          if (file) setCurrentImage(URL.createObjectURL(file));
                        }}
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="cursor-pointer text-primary"
                      >
                        Click or drag to upload
                      </label>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full border rounded p-2"
            />
            {errors.title && <p className="text-red-500 text-xs">Required</p>}
          </div>

          <div>
            <label className="block text-sm">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full border rounded p-2"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">Required</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Club</label>
            <Controller
              name="organization_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Combobox
                  value={
                    clubs.find((c) => c.organization_id === field.value) || null
                  }
                  onChange={(c: Organization) => field.onChange(c.organization_id)}
                  nullable
                >
                  <Combobox.Input
                    className="w-full border rounded p-2"
                    displayValue={(c: Organization) => c?.name || ""}
                    onChange={(e) => setClubQuery(e.target.value)}
                    placeholder="Search clubs..."
                  />
                  <Combobox.Options className="mt-2 max-h-40 overflow-auto rounded border bg-white">
                    {clubs.map((c) => (
                      <Combobox.Option
                        key={c.organization_id}
                        value={c}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {c.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              )}
            />
            {errors.organization_id && (
              <p className="text-red-500 text-xs">Required</p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Location</h2>
          <LocationPicker
            location={
              location && !(location.lat === 0 && location.lng === 0)
                ? location
                : null
            }
            address={address ?? ""}
            onChange={(loc, addr) => {
              updateLocation(loc);
              setValue("address", addr);
            }}
            onAddressChange={(addr) => setValue("address", addr)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Schedule</h2>
          <div>
            <label className="block text-sm">Start</label>
            <input
              type="datetime-local"
              {...register("start_date", { required: true })}
              className="w-full border rounded p-2"
            />
            {errors.start_date && (
              <p className="text-red-500 text-xs">Required</p>
            )}
          </div>
          <div>
            <label className="block text-sm">End</label>
            <input
              type="datetime-local"
              {...register("end_date", {
                required: true,
                validate: (v) => v > (watched?.start_date ?? ""),
              })}
              className="w-full border rounded p-2"
            />
            {errors.end_date && (
              <p className="text-red-500 text-xs">End must be after start</p>
            )}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Review</h2>
          {currentImage && (
            <Image
              src={currentImage}
              alt="Location preview"
              className="w-full rounded"
              width={600}
              height={300}
            />
          )}
          <div className="bg-gray-50 p-4 rounded text-sm">
            <p>
              <strong>Title:</strong> {watched.title}
            </p>
            <p>
              <strong>Description:</strong> {watched.description}
            </p>
            <p>
              <strong>Club:</strong>{" "}
              {clubs.find((c) => c.organization_id === watched.organization_id)
                ?.name || watched.organization_id}
            </p>
            <p>
              <strong>When:</strong>{" "}
              {watched.start_date && watched.end_date
                ? formatEventDateRange(watched.start_date, watched.end_date)
                : ""}
            </p>
            <p>
              <strong>Address:</strong> {watched.address}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center mt-6 gap-2">
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 text-red-600"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 1))}
          disabled={step === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft className="inline w-4 h-4" /> Back
        </button>
        <div className="flex-1 text-center" />
        <button
          type="button"
          onClick={
            step < 4
              ? () => setStep((s) => Math.min(s + 1, 4))
              : handleSubmit(onSubmit)
          }
          disabled={(step < 4 && !isValid) || submitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-[#624080] disabled:opacity-50"
        >
          {step < 4 ? (
            <>
              Next <ChevronRight className="inline w-4 h-4" />
            </>
          ) : (
            "Finish"
          )}
        </button>
      </div>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}

