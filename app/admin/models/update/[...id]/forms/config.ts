import { Model, ModelUpdateInput } from "@/db/schemas/models";
import { lazy, LazyExoticComponent } from "react";
const generalForm = lazy(() => import("./general-form"));
const contactForm = lazy(() => import("./contact-form"));
const backgroundForm = lazy(() => import("./background-form"));
const identificaitonForm = lazy(() => import("./identification-form"));
const addressForm = lazy(() => import("./address-form"));
const modelingForm = lazy(() => import("./modeling-form"));
const measurementForm = lazy(() => import("./measurement-form"));

export const forms: {
  [key: string]: LazyExoticComponent<
    ({}: {
      initialData: Model;
      onSubmit: (formData: ModelUpdateInput) => void;
    }) => JSX.Element
  >;
} = {
  general: generalForm,
  contact: contactForm,
  background: backgroundForm,
  identificaiton: identificaitonForm,
  address: addressForm,
  modeling: modelingForm,
  measurement: measurementForm,
};
