"use client";

import ContactForm from "./_components/contact-form";
import ExpereicensForm from "./_components/experience-form";
import { useFormContext, Form } from "./_components/form-context";
import GeneralForm from "./_components/general-form";
import ImagesForm from "./_components/images-form";
import MeausrementForm from "./_components/measurement-form";
import Submit from "./_components/submit";
import TalentForm from "./_components/talent-form";

const forms: Record<Form, JSX.Element> = {
  general: <GeneralForm />,
  contact: <ContactForm />,
  measurements: <MeausrementForm />,
  talents: <TalentForm />,
  experiences: <ExpereicensForm />,
  images: <ImagesForm />,
  submit: <Submit />,
};

export default function Page() {
  const { form } = useFormContext();
  return <>{forms[form]}</>;
}
