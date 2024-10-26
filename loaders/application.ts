import "server-only";
import { redirect } from "next/navigation";
import { getApplicationTokenOrRedirect } from "@/actions/application/utils";
import { GetApplicationsFilter } from "@/lib/usecases";
import { applicationUseCase } from "@/config";
import { Application } from "@/lib/domains";

export async function getApplicationByToken(): Promise<Application> {
  const token = await getApplicationTokenOrRedirect();
  const application = await applicationUseCase.getApplicationByToken(token);

  if (!application) {
    redirect("/application/new");
  }

  return application;
}

export const getApplicationExerperiencesByToken = async () => {
  const token = await getApplicationTokenOrRedirect();
  const experiences = await applicationUseCase.getApplicationExperienceByToken(
    token
  );
  if (!experiences) {
    redirect("/application/new");
  }
  return experiences;
};

export const getApplicationImagesByToken = async () => {
  const token = await getApplicationTokenOrRedirect();
  const images = await applicationUseCase.getImagesByToken(token);
  if (!images) {
    redirect("/application/new");
  }
  return images;
};

export const safeValidationApplicationAction = async () => {
  const token = await getApplicationTokenOrRedirect();
  return applicationUseCase.safeValidateApplication(token);
};

export const getApplications = async (filter: GetApplicationsFilter) => {
  return applicationUseCase.getApplications(filter);
};

export const getApplication = async (id: string) => {
  return applicationUseCase.getApplication(id);
};

export const getApplicationExperiences = async (id: string) => {
  return applicationUseCase.getApplicationExperiences(id);
};

export const getApplicationImages = async (id: string) => {
  return applicationUseCase.getImages(id);
};
