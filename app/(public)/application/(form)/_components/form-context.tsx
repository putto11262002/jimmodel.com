"use client";
import { ApplicationImageType } from "@/db/schemas";
import {
  ApplicationCreateInput,
  ApplicationImageCreateInput,
} from "@/lib/types/application";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type Form =
  | "general"
  | "contact"
  | "measurements"
  | "talents"
  | "experiences"
  | "images"
  | "submit";

type FormData = Partial<ApplicationCreateInput>;

type ImageCreateInput = Extract<ApplicationImageCreateInput, { file: Blob }>;

export type FormContext = {
  form: Form;
  next: () => void;
  application: Partial<ApplicationCreateInput>;
  setApplication: Dispatch<SetStateAction<Partial<ApplicationCreateInput>>>;
  images: ImageCreateInput[];
  setImages: Dispatch<SetStateAction<ImageCreateInput[]>>;
  appendImage: (input: ImageCreateInput) => void;
  formIndex: number;
};
export const formContext = createContext<FormContext>({
  form: "general",
  appendImage: () => {},
  next: () => {},
  setApplication: () => {},
  setImages: () => {},
  application: {},
  images: [],
  formIndex: 0,
});

export const forms: Form[] = [
  "general",
  "contact",
  "measurements",
  "talents",
  "experiences",
  "images",
  "submit",
];

export const useFormContext = () => useContext(formContext);

export default function FormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [application, setApplication] = useState<FormData>({});
  const [images, setImages] = useState<ImageCreateInput[]>([]);
  const [formIndex, setFormIndex] = useState(0);

  function next() {
    if (formIndex < forms.length - 1) {
      setFormIndex((prev) => prev + 1);
    }
  }

  function appendImage(input: ImageCreateInput) {
    setImages((prev) => [...prev, input]);
  }

  return (
    <formContext.Provider
      value={{
        appendImage,
        formIndex,
        form: forms[formIndex],
        next,
        application,
        setApplication,
        setImages,
        images,
      }}
    >
      {children}
    </formContext.Provider>
  );
}
