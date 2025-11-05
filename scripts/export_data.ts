import { fileUseCase, modelUseCase } from "@/config";
import { Model } from "@/lib/domains";
import fs from "fs/promises";

// Grab all the models from the database
//
let hasMore = true;

const outputDir = "./exports/models";

const modelOutput: (Model & { modelProfileImagePath: string | null })[] = [];

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  while (hasMore) {
    const models = await modelUseCase.getModels({
      pagination: false,
      compact: false,
    });

    hasMore = models.hasNext;

    for (const model of models.data) {
      try {
        // save model images
        const modelAssetsDir = `${outputDir}/${model.id}/assets`;
        await fs.mkdir(`${outputDir}/${model.id}`, { recursive: true });
        await fs.mkdir(modelAssetsDir, { recursive: true });

        const images = await modelUseCase.getModelImages(model.id);
        for (const image of images) {
          const imageBlob = await fileUseCase.download(image.fileId);
          console.log(
            "Saving image for model:",
            model.id,
            "image:",
            image.fileId,
          );
          await fs.writeFile(
            `${modelAssetsDir}/${image.fileId}-${image.type}.jpeg`,
            Buffer.from(await imageBlob.arrayBuffer()),
          );
          console.log(
            "Saved image for model:",
            model.id,
            "image:",
            image.fileId,
          );
        }

        modelOutput.push({
          ...model,
          modelProfileImagePath: model.profileImageId
            ? `${modelAssetsDir}/profile-image.jpeg`
            : null,
        });
        console.log("Exported model:", model.id);
      } catch (error) {
        console.error("Error exporting model:", model.id, error);
      }
    }
  }
  await fs.writeFile(
    `${outputDir}/models.json`,
    JSON.stringify(modelOutput, null, 2),
  );
  console.log("Exported all models to", `${outputDir}/models.json`);
}

main();
