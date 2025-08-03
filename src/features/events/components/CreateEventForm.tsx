"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import type { Library } from "@googlemaps/js-api-loader";
import { Combobox } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { fetchClubs, type Organization } from "@/features/organizations/api";
import { EMPTY_EVENT_FORM, type EventFormValues } from "@/constants/defaults";


const libraries: Library[] = ["places", "marker"];

export default function CreateEventForm() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries,
  });
const placeRef = useRef<PlaceAutocompleteElement>(null!);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [clubs, setClubs] = useState<Organization[]>([]);
  const [clubQuery, setClubQuery] = useState("");
  const { user } = useCurrentUser();
  const updateLocation = async (loc: { lat: number; lng: number }) => {
    setMapCenter(loc);
    setValue("location", loc);
    if (geocoderRef.current) {
      await geocode(loc);
    }
  };

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

  const location = useWatch({ control, name: "location" });

  useEffect(() => {
    geocoderRef.current = isLoaded ? new google.maps.Geocoder() : null;
    if (isLoaded && location) {
      geocoderRef.current
        ?.geocode({ location })
        .then(({ results }) => {
          const addr = results[0]?.formatted_address || "";
          setValue("address", addr);
          if (placeRef.current) placeRef.current.nodeValue = addr;
        });
    }
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
        await updateLocation(loc);
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
        .from("oy_media")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage
        .from("oy_media")
        .getPublicUrl(filePath);

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
        image_url: publicUrl.publicUrl,
      });
      if (error) throw error;
      alert("Event created");
    } catch (e) {
      alert(String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = ["Details", "Location", "Schedule", "Review"];

async function geocode(loc: { lat: number; lng: number }){
    const { results } = await geocoderRef.current!.geocode({ location: loc });
    const addr = results[0]?.formatted_address || "";
    setValue("address", addr);
    if (placeRef.current) placeRef.current.nodeValue = addr;
  };

  

  useEffect(() => {
    if (!location || !mapRef.current || !isLoaded) return;
    const pin = new google.maps.marker.PinElement({
      background: "#745296",
      borderColor: "#745296",
      glyphColor: "#A38BC3",
    });
    if (!markerRef.current) {
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: mapRef.current,
        gmpDraggable: true,
        content: pin.element,
      });
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current!.position as google.maps.LatLng;
        updateLocation({ lat: pos.lat(), lng: pos.lng() });
      });
    } else {
      markerRef.current.position = location;
    }
  }, [location, isLoaded]);

  useEffect(() => {
    if (!placeRef.current) return;
    const el = placeRef.current;
    const handler = () => {
      const place = el as google.maps.places.PlaceResult;
      const loc = place.geometry?.location as google.maps.LatLng | undefined;
      if (loc) {
        updateLocation({ lat: loc.lat(), lng: loc.lng() });
      }
      const addr =
        (place as unknown as { formattedAddress?: string }).formattedAddress ??
        place.formatted_address ??
        "";
      setValue("address", addr);
    };
    el.addEventListener("placechange", handler);
    return () => el.removeEventListener("placechange", handler);
  }, [updateLocation, setValue]);

  useEffect(() => {
    register("location", { required: true });
    register("address");
  }, [register]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          <gmpx-place-autocomplete
            ref={placeRef}
            className="w-full border rounded p-2 mb-2"
            placeholder="Search address"
          />
          <GoogleMap
            options={{ mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID }}
            mapContainerStyle={{ width: "100%", height: "240px" }}
            center={mapCenter}
            zoom={17}
            onLoad={(map) => {
              mapRef.current = map;
            }}
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
              <strong>When:</strong> {watched.start_date} – {watched.end_date}
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
          type={step < 4 ? "button" : "submit"}
          onClick={
            step < 4 ? () => setStep((s) => Math.min(s + 1, 4)) : undefined
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
    </form>
  );
}
