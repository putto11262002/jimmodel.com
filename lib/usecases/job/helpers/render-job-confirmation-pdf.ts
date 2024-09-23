import webConfig from "@/config/web";
import { Booking, Job } from "@/lib/domains";
import { columnFormatter, writePdfDocToWritableStream } from "@/lib/utils/pdf";
import { PDFDoc } from "easy-pdfkit";

export async function renderJobConfirmation(
  data: { job: Job; bookings: Booking[] },
  output: WritableStream<any>
) {
  const { job, bookings } = data;
  const doc = new PDFDoc({
    header: `${webConfig.fullCompanyName}`,
    headingConfig: {
      h1: { size: 18 },
      h2: { size: 14 },
      normal: { size: 9 },
    },
  });
  doc.heading("JOB COMFIRMATION", "h1").moveDown();

  renderFromToSection(doc);

  renderJobDetailsSection(doc, job);

  renderModelSection(doc, job);

  renderBookingSection(doc, bookings);

  renderSignatureSection(
    doc,
    webConfig.fullCompanyName,
    job.client || "the client"
  );
  await writePdfDocToWritableStream(doc, output);
}

function renderFromToSection(doc: PDFDoc) {
  const columnGap = 10;
  const textLineGap = 5;
  const columnWidth = (doc.getMarginAdjustedWidth() - columnGap) / 2;
  const lineY = doc.y;

  let lineStart: number;
  let lineEnd: number;
  let columnStart: number;
  let text: string;

  text = "FROM: ";
  columnStart = doc.getMarginAdjustedZeroX();
  lineStart = columnStart + doc.widthOfString(text) + textLineGap;
  lineEnd =
    doc.getMarginAdjustedZeroX() + columnWidth - columnGap - textLineGap;

  doc.heading(text, "normal", columnStart, lineY, {});
  doc
    .moveTo(lineStart, lineY + doc.currentFontSize)
    .lineTo(lineEnd, lineY + doc.currentFontSize)
    .stroke();

  text = "TO: ";
  columnStart = doc.getMarginAdjustedZeroX() + columnWidth + columnGap;

  lineStart = columnStart + doc.widthOfString(text, {}) + textLineGap;

  lineEnd = doc.getMarginAdjustedZeroX() + doc.getMarginAdjustedWidth();

  doc.heading(text, "normal", columnStart, lineY, {});

  doc
    .moveTo(lineStart, lineY + doc.currentFontSize)
    .lineTo(lineEnd, lineY + doc.currentFontSize)
    .stroke();

  // Move down to the next line
  doc.x = doc.getMarginAdjustedZeroX();
  doc.moveDown();
}

function renderJobDetailsSection(doc: PDFDoc, job: Job) {
  doc.heading("JOB DETAILS", "h2");
  doc.table(
    {
      columns: [{ key: "key" }, { key: "value", colSpan: 2 }] as const,
      header: false,
    },
    [
      {
        key: "Title",
        value: job.name,
      },
      {
        key: "Client",
        value: job.client,
      },
      {
        key: "Client Address",
        value: job.clientAddress,
      },
      {
        key: "Person In Charge",
        value: job.personInCharge,
      },
      {
        key: "Meida Released",
        value: job.mediaReleased,
      },
      {
        key: "Period Released",
        value: job.periodReleased,
      },
      {
        key: "Territories Released",
        value: job.territoriesReleased,
      },
      {
        key: "Venue of Shoot",
        value: job.venueOfShoot,
      },
      {
        key: "Fee as Agreed",
        value: job.feeAsAgreed,
      },
      {
        key: "Overtime",
        value: job.overtimePerHour,
      },
      {
        key: "Term of Payment",
        value: job.termsOfPayment,
      },
      {
        key: "Cancellation",
        value: job.cancellationFee,
      },
      {
        key: "Details",
        value: job.contractDetails,
      },
    ]
  );
}

function renderModelSection(doc: PDFDoc, job: Job) {
  if (job.jobModels.length < 1) return;
  doc.heading("MODELS", "h2");
  doc.table(
    {
      columns: [{ key: "modelName" }] as const,
      header: false,
    },
    job.jobModels
  );
}

function renderBookingSection(doc: PDFDoc, bookings: Booking[]) {
  if (bookings.length < 1) return;
  doc.heading("BOOKINGS", "h2");
  doc.table(
    {
      columns: [
        { key: "start", header: "Start Date" },
        { key: "end", header: "End Date" },
        { key: "type", header: "Type" },
      ] as const,
    },
    bookings
  );
}

function renderSignatureSection(doc: PDFDoc, party1: string, party2: string) {
  doc
    .heading(
      "REMARK: Should an advertiser wish to use the material produced for any additional usage, it is their material produced for any additional usage, it is their",
      "normal"
    )
    .moveDown()
    .heading("PEPARED BY:", "normal")
    .moveDown()
    .heading("AGREED AND ACCEPTED BY:", "normal")
    .moveDown(2);

  const columns = columnFormatter({
    width: doc.getMarginAdjustedWidth(),
    numCols: 2,
    gap: 10,
    doc: doc,
  });
  const prevY = doc.y;
  doc
    .moveTo(columns[0].start, doc.y)
    .lineTo(columns[0].end, doc.y)
    .stroke()
    .moveDown()
    .heading(`For and on behalf of ${party1}.`, "normal", columns[0].start);

  doc.y = prevY;
  doc
    .moveTo(columns[1].start, doc.y)
    .lineTo(columns[1].end, doc.y)
    .stroke()
    .moveDown()
    .heading(`For and on behalf of ${party2}.`, "normal", columns[1].start);
}
