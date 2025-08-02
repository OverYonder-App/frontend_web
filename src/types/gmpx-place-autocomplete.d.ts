import type React from "react";

declare global {
  interface PlaceAutocompleteElement extends HTMLInputElement {
    getPlace(): google.maps.places.PlaceResult;
  }

  namespace React.JSX {
    interface IntrinsicElements {
      "gmpx-place-autocomplete": React.DetailedHTMLProps<
        React.InputHTMLAttributes<PlaceAutocompleteElement>,
        PlaceAutocompleteElement
      >;
    }
  }
}

export {};
