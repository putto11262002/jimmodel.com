import dayjs from "dayjs";
import { columnFormatter, writePdfDocToWritableStream } from "@/lib/utils/pdf";
import { PDFDoc } from "easy-pdfkit";
import { Model } from "@/lib/domains";

export async function renderModelProfileSheet(
  model: Model,
  modelProfileImage: Buffer | null,
  output: WritableStream<any>
) {
  const doc = new PDFDoc({
    header: `JIMMODEL`,
    headingConfig: {
      h1: { size: 18 },
      h2: { size: 14 },
    },
    layout: "landscape",
  });

  doc.heading(`MODEL PROFILE - ${model.name}`, "h1");

  renderProfileSection(doc, model);
  const columns = columnFormatter({
    doc,
    numCols: 2,
    width: doc.getMarginAdjustedWidth(),
    gap: 10,
  });
  const columnsY = doc.y;

  renderProfileImage(
    doc,
    modelProfileImage,
    columns[1].start,
    columns[1].end,
    columnsY
  );

  renderMeasuresSection(doc, model, columns[0].start, columns[0].end, columnsY);

  await writePdfDocToWritableStream(doc, output);
}

function renderProfileSection(doc: PDFDoc, model: Model) {
  doc
    .text("Country: ", { continued: true })
    .multiTypeText(model.country, { continued: true })
    .text("  Age: ", { continued: true })
    .multiTypeText(dayjs().diff(dayjs(model.dateOfBirth), "year"), {
      continued: true,
    })
    .text("  Height: ", { continued: true })
    .multiTypeText(model.height, { continued: true })
    .text("  Weight: ", { continued: true })
    .multiTypeText(model.weight, { continued: true })
    .text("  Hair: ", { continued: true })
    .multiTypeText(model.hairColor, { continued: true })
    .text("  Eye: ", { continued: true })
    .multiTypeText(model.eyeColor, { continued: false })
    .moveDown();
}

function renderProfileImage(
  doc: PDFDoc,
  profileImage: Buffer | null,
  start: number,
  end: number,
  y: number
) {
  const cellWidth = end - start;
  const cellHeight = doc.getMarginAdjustedHeight() - y;
  if (profileImage) {
    // Calculate the 2:3 aspect ratio that best fits the cell width and height
    const aspectRatio = 2 / 3;
    const imageWidth = Math.min(cellWidth, cellHeight * aspectRatio);
    const imageHeight = imageWidth / aspectRatio;
    doc.image(
      profileImage,
      start + (cellWidth - imageWidth) / 2,
      y + (cellHeight - imageHeight) / 2,
      {
        width: imageWidth,
        height: imageHeight,
        cover: [imageWidth, imageHeight],
      }
    );
  } else {
    const text = "No image available";
    const textWidth = doc.widthOfString(text);
    const textHeight = doc.heightOfString(text);
    doc.text(
      text,
      start + (cellWidth - textWidth) / 2,
      y + (cellHeight - textHeight) / 2
    );
  }
}

function renderMeasuresSection(
  doc: PDFDoc,
  model: Model,
  start: number,
  end: number,
  y: number
) {
  const prevFontSize = doc.currentFontSize;
  doc.fontSize(10);
  doc.table(
    {
      columns: [{ key: "key" }, { key: "value", colSpan: 2 }] as const,
      header: false,
      borders: false,
      cellPaddings: { left: 0, right: 0, top: 2, bottom: 2 },
      x: start,
      y: y,
      width: end - start,
    },
    [
      {
        key: "Collar",
        value: model.collar,
      },
      {
        key: "Front Shoulder",
        value: model.frontShoulder,
      },
      {
        key: "Body Front Length",
        value: model.frontLength,
      },
      {
        key: "Chest",
        value: model.chest,
      },
      {
        key: "Bust",
        value: model.bust,
      },
      {
        key: "Waist",
        value: model.waist,
      },
      {
        key: "Shoulder",
        value: model.shoulder,
      },
      {
        key: "Back Shoulder",
        value: model.backShoulder,
      },
      {
        key: "Back Length",
        value: model.backLength,
      },
      {
        key: "Armpit",
        value: model.aroundArmpit,
      },
      {
        key: "Upper Arm",
        value: model.aroundUpperArm,
      },
      {
        key: "Arm Length",
        value: model.shoulderToWrist,
      },
      {
        key: "Wrist",
        value: model.aroundWrist,
      },
      {
        key: "Crotch",
        value: model.crotch,
      },
      {
        key: "Around Thigh",
        value: model.aroundThigh,
      },
      {
        key: "Outseam",
        value: model.outSeam,
      },
      {
        key: "Inseam",
        value: model.inSeam,
      },
      {
        key: "Ankle",
        value: model.aroundAnkle,
      },
      {
        key: "Bra Size",
        value: model.braSize,
      },
      {
        key: "Shoe Size",
        value: model.shoeSize,
      },
    ]
  );
  doc.fontSize(prevFontSize);
}
