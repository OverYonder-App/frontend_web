export interface EventFormValues {
  title: string;
  description: string;
  organization_id: string;
  imageFile: FileList | null;
  location: { lat: number; lng: number };
  address: string;
  start_date: string;
  end_date: string;
}

export const EMPTY_EVENT_FORM: EventFormValues = {
  title: "",
  description: "",
  organization_id: "",
  imageFile: null,
  location: { lat: 0, lng: 0 },
  address: "",
  start_date: "",
  end_date: "",
};
