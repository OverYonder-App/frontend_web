"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Autocomplete, GoogleMap, useLoadScript } from "@react-google-maps/api";
import type { Library } from "@googlemaps/js-api-loader";
import { Combobox } from "@headlessui/react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { fetchClubs, type Organization } from "@/features/organizations/api";
import { EMPTY_EVENT_FORM, type EventFormValues } from "@/constants/defaults";
import { Toast } from "@/components/Toast";


const libraries: Library[] = ["places", "marker"];

function formatEventDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${format(startDate, "EEEE, MMMM d, yyyy")}, from ${format(
    startDate,
    "h:mm a",
  )} to ${format(endDate, "h:mm a")}`;
}

export default function CreateEventForm() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<EventFormValues>({
    mode: "onChange",
    defaultValues: EMPTY_EVENT_FORM,
  });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocodeCache = useRef<Map<string, string>>(new Map());
  const skipGeocodeRef = useRef(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [clubs, setClubs] = useState<Organization[]>([]);
  const [clubQuery, setClubQuery] = useState("");
  const { user } = useCurrentUser();
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const updateLocation = useCallback(
    (loc: { lat: number; lng: number }) => {
      setMapCenter(loc);
      setValue("location", loc);
    },
    [setValue]
  );

  

  const location = useWatch({ control, name: "location" });
  const address = useWatch({ control, name: "address" });

  useEffect(() => {
    if (isLoaded) geocoderRef.current = new google.maps.Geocoder();
  }, [isLoaded]);

  useEffect(() => {
    if (
      !isLoaded ||
      !location ||
      (location.lat === 0 && location.lng === 0) ||
      !geocoderRef.current
    )
      return;

    if (skipGeocodeRef.current) {
      skipGeocodeRef.current = false;
      return;
    }

    const key = `${location.lat},${location.lng}`;
    const cached = geocodeCache.current.get(key);
    if (cached) {
      setValue("address", cached);
      return;
    }

    geocoderRef.current
      .geocode({ location })
      .then(({ results }) => {
        const addr = results[0]?.formatted_address || "";
        geocodeCache.current.set(key, addr);
        setValue("address", addr);
      })
      .catch(() => {
        setValue("address", "");
      });
  }, [isLoaded, location, setValue]);

  useEffect(() => {
    async function loadInstitution() {
      if (!user?.institution_id) return;
      const { data } = await supabase
        .from("institutions")
        .select("latitude, longitude")
        .eq("institution_id", user.institution_id)
        .single();
      if (data) {
        const loc = { lat: data.latitude, lng: data.longitude };
        updateLocation(loc);
      }
    }
    loadInstitution();
    }, [user, updateLocation]);

  useEffect(() => {
    fetchClubs({ search: clubQuery }).then(({ clubs }) => setClubs(clubs));
  }, [clubQuery]);

  const watched = useWatch({ control });

  const onSubmit = async (data: EventFormValues) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const eventId = crypto.randomUUID();
      const file = data.imageFile![0];
      const ext = file.name.split(".").pop();
      const filePath = `${user.institution_id}/events/${eventId}/banner.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("oy-media")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const {
        data: signedUrlData,
        error: signedUrlError,
      } = await supabase.storage
        .from("oy-media")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 100);
      if (signedUrlError) throw signedUrlError;

      const { error } = await supabase.from("events").insert({
        event_id: eventId,
        title: data.title,
        description: data.description,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        organization_id: data.organization_id,
        institution_id: user.institution_id,
        created_by: user.id,
        latitude: data.location.lat,
        longitude: data.location.lng,
        address: data.address || null,
        status: "approved",
        visibility_level: "public",
        image_url: signedUrlData.signedUrl,
      });
      if (error) throw error;
      setToast({ msg: "Event created", type: "success" });
    } catch (e) {
      setToast({ msg: String(e), type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = ["Details", "Location", "Schedule", "Review"];

  useEffect(() => {
    if (!location || !map || !isLoaded) return;
    const pin = new google.maps.marker.PinElement({
      background: "#745296",
      borderColor: "#745296",
      glyphColor: "#A38BC3",
    });
    if (!markerRef.current) {
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map,
        gmpDraggable: true,
        content: pin.element,
      });
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current!.position as
          | google.maps.LatLng
          | google.maps.LatLngLiteral;
        const lat = pos instanceof google.maps.LatLng ? pos.lat() : pos.lat;
        const lng = pos instanceof google.maps.LatLng ? pos.lng() : pos.lng;
        updateLocation({ lat, lng });
      });
    } else {
      markerRef.current.position = location;
      markerRef.current.map = map;
    }
  }, [location, map, isLoaded, updateLocation]);

  useEffect(() => {
    if (map && location) {
      map.setCenter(location);
    }
  }, [map, location]);

  // Autocomplete input handles place selection via onPlaceChanged

  useEffect(() => {
    register("location", { required: true });
    register("address");
  }, [register]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="p-4 bg-gray-100 rounded-xl shadow"
    >
      <h1 className="text-xl font-semibold mb-2">Create New Event</h1>
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
              step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
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
              rules={{
                validate: async (v) => {
                  const file = v?.[0];
                  if (!file) return "Required";
                  if (file.size > 2 * 1024 * 1024) return "Max size 2MB";
                  const valid = await new Promise<boolean>((resolve) => {
                    const img = new window.Image();
                    img.onload = () =>
                      resolve(img.width >= 800 && img.height >= 400);
                    img.onerror = () => resolve(false);
                    img.src = URL.createObjectURL(file);
                  });
                  return valid || "Min dimensions 800x400";
                },
              }}
              render={({ field }) => (
                <>
                  {field.value?.[0] ? (
                    <div className="relative inline-block">
                      <Image
                        src={URL.createObjectURL(field.value[0])}
                        alt="Preview"
                        className="h-32 w-48 object-cover rounded"
                        width={192}
                        height={128}
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e.target.files)
                        }
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="cursor-pointer text-blue-600"
                      >
                        Click or drag to upload
                      </label>
                    </div>
                  )}
                </>
              )}
            />
            {errors.imageFile && (
              <p className="text-red-500 text-xs">
                {errors.imageFile.message as string}
              </p>
            )}
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
                  onChange={(c: Organization) =>
                    field.onChange(c.organization_id)
                  }
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
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={() => {
              const place = autocompleteRef.current!.getPlace();
              const loc = place.geometry?.location;
              if (loc) {
                skipGeocodeRef.current = true;
                updateLocation({ lat: loc.lat(), lng: loc.lng() });
              }
              const addr = place.formatted_address || "";
              setValue("address", addr);
            }}
          >
            <input
              value={address ?? ""}
              onChange={(e) => setValue("address", e.target.value)}
              type="text"
              className="w-full border rounded p-2 mb-2"
              placeholder="Search address"
            />
          </Autocomplete>
          <GoogleMap
            options={{ mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID }}
            mapContainerStyle={{ width: "100%", height: "240px" }}
            center={mapCenter}
            zoom={17}
            onLoad={(m) => setMap(m)}
            onUnmount={() => setMap(null)}
            onClick={(e: google.maps.MapMouseEvent) =>
              updateLocation({
                lat: e.latLng!.lat(),
                lng: e.latLng!.lng(),
              })
            }
          ></GoogleMap>
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
          <Image
            src={URL.createObjectURL(watched.imageFile?.[0] ?? new Blob())}
            alt="Location preview"
            className="w-full rounded"
            width={600}
            height={300}
          />
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

      <div className="flex items-center mt-6">
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
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
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
