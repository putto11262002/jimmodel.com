import "server-only";
import {
  GetModelBlocksFilter,
  GetModelFilter,
  GetModelImagesFilter,
  GetModelsFilter,
} from "@/lib/usecases";
import { cache } from "react";
import { notFound } from "next/navigation";
import { modelUseCase } from "@/config";

export const getModels = cache(async (filter: GetModelsFilter) => {
  return modelUseCase.getModels({ ...filter, compact: false });
});

export const getPublishedModels = cache(async (filter: GetModelsFilter) => {
  return modelUseCase.getModels({ ...filter, compact: false, published: true });
});

export const getCompactModels = cache(async (filter: GetModelsFilter) => {
  return modelUseCase.getModels({ ...filter, compact: true });
});

export const getModelOrThrow = cache(
  async (id: string, filter?: GetModelFilter) => {
    const model = await modelUseCase.getModel(id, false, filter);
    if (!model) {
      notFound();
    }
    return model;
  }
);

export const getModelExperiences = cache(async (id: string) => {
  return modelUseCase.getModelExperiences(id);
});

export const getModelImages = cache(
  async (id: string, filter?: GetModelImagesFilter) => {
    return modelUseCase.getModelImages(id, filter);
  }
);

export const getModelBlocks = cache(async (filter: GetModelBlocksFilter) => {
  return modelUseCase.getBlocks(filter);
});
