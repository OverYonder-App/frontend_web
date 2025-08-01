export const DEFAULT_CATEGORIES = [
  "Social",
  "Academic",
  "Sports",
  "Cultural",
  "Other",
] as const;

export const DEFAULT_CLUBS = [
  "Chess Club",
  "Math Club",
  "Coding Club",
] as const;

export const DEFAULT_GROUPS = [
  "Group A",
  "Group B",
  "Group C",
] as const;

export const DEFAULT_WEEK_DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;

export interface EventFormValues {
  imageFile: FileList | null;
  category: string;
  title: string;
  description: string;
  tags: string[];
  location: { lat: number; lng: number };
  visibility: "Everyone" | "Club" | "Group";
  selectedClub: string;
  selectedGroup: string;
  start: string;
  end: string;
  recurrence: "none" | "daily" | "weekly" | "monthly";
  weekDays: string[];
  monthInterval: number;
}

export const EMPTY_EVENT_FORM: EventFormValues = {
  imageFile: null,
  category: "",
  title: "",
  description: "",
  tags: [],
  location: { lat: 43.65362, lng: -116.67693 },
  visibility: "Everyone",
  selectedClub: "",
  selectedGroup: "",
  start: "",
  end: "",
  recurrence: "none",
  weekDays: [],
  monthInterval: 1,
};
