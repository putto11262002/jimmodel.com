import { Showcase as _Showcase } from "@/db/schemas";
import { ShowcaseModel } from "./model";
import { ShowcaseImage } from "./image";
import { ShowcaseLink } from "./link";

export type Showcase = _Showcase & {
  showcaseModels: ShowcaseModel[];
  showcaseImages: ShowcaseImage[];
  links: ShowcaseLink[];
};

export type LeanShowcase = _Showcase;
